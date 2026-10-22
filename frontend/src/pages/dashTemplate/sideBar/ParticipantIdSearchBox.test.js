import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { print } from 'graphql/language/printer';
import client from '../../../utils/graphqlClient';
import ParticipantIdSearchBox from './ParticipantIdSearchBox';

jest.mock('../../../utils/graphqlClient', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

// The real multiple Autocomplete follows each keystroke with a 'reset' and can close the list.
// Both cancel the 300ms search timer, so this stand-in only emits reason 'input' and renders the open options as given.
jest.mock('@material-ui/lab/Autocomplete', () => {
  const React = require('react');
  return function MockAutocomplete(props) {
    const label = props['aria-label'];
    return React.createElement(
      'div',
      { role: 'combobox', 'aria-label': label },
      React.createElement('input', {
        'aria-label': label,
        onChange: (event) => props.onInputChange(event, event.target.value, 'input'),
      }),
      props.open
        ? props.options.map((option) => {
          const text = props.getOptionLabel(option);
          return React.createElement('div', { key: text }, text);
        })
        : null,
    );
  };
});

// Printed GraphQL documents, so a call can be recognized as idsLists or participantIdSuggestions.
function queryNames() {
  return client.query.mock.calls.map((call) => print(call[0].query));
}

function searchInput() {
  return screen.getByRole('combobox', { name: 'Search by Participant IDs' }).querySelector('input');
}

// Lodash debounce waits on Date.now(), so the fake clock has to move with the timer.
let now = 0;

// Runs the 300ms suggestion timer and the promise that applies the response.
async function flushDebounce() {
  await act(async () => {
    now += 300;
    jest.advanceTimersByTime(300);
  });
  await act(async () => {
    await Promise.resolve();
  });
}

describe('Participant id search box', () => {
  // Fake timers control the debounce. The client returns two ids unless a test replaces that page.
  beforeEach(() => {
    document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
    });
    now = 0;
    jest.useFakeTimers();
    jest.spyOn(Date, 'now').mockImplementation(() => now);
    client.query.mockResolvedValue({
      data: { participantIdSuggestions: ['PART-001', 'PART-002'] },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    if (Date.now.mockRestore) {
      Date.now.mockRestore();
    }
    client.query.mockReset();
  });

  // Opening the box has no prefix yet, so it must not download idsLists or any other query.
  it('does not load every id when the box opens', () => {
    render(<ParticipantIdSearchBox />);

    expect(queryNames().join('\n')).not.toContain('idsLists');
    expect(client.query).not.toHaveBeenCalled();
  });

  // One character is too broad. After the debounce, the box still must not query.
  it('does not search a one character prefix', async () => {
    render(<ParticipantIdSearchBox />);

    fireEvent.change(searchInput(), {
      target: { value: 'P' },
    });
    await flushDebounce();

    expect(client.query).not.toHaveBeenCalled();
  });

  // A burst of keystrokes collapses into one participantIdSuggestions query for the latest prefix.
  it('searches the last prefix after rapid typing', async () => {
    render(<ParticipantIdSearchBox />);
    const input = searchInput();

    fireEvent.change(input, { target: { value: 'P' } });
    fireEvent.change(input, { target: { value: 'PA' } });
    fireEvent.change(input, { target: { value: 'PAR' } });
    await flushDebounce();

    expect(client.query).toHaveBeenCalledTimes(1);
    expect(client.query.mock.calls[0][0].variables).toEqual({ prefix: 'PAR', first: 20 });
    const printed = queryNames().join('\n');
    expect(printed).toContain('participantIdSuggestions');
    expect(printed).not.toContain('idsLists');
  });

  // The dropdown shows the server page unchanged, including an id that does not contain the typed text.
  it('shows the server page without client filtering', async () => {
    client.query.mockResolvedValue({
      data: { participantIdSuggestions: ['PART-001', 'OTHER-999'] },
    });
    render(<ParticipantIdSearchBox />);

    fireEvent.change(searchInput(), {
      target: { value: 'PART' },
    });
    await flushDebounce();

    expect(screen.getByText('PART-001')).toBeInTheDocument();
    expect(screen.getByText('OTHER-999')).toBeInTheDocument();
  });
});
