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

function queryNames() {
  return client.query.mock.calls.map((call) => print(call[0].query));
}

function searchInput() {
  return screen.getByRole('combobox', { name: 'Search by Participant IDs' }).querySelector('input');
}

async function flushDebounce() {
  await act(async () => {
    jest.advanceTimersByTime(300);
  });
  await act(async () => {
    await Promise.resolve();
  });
}

describe('Participant id search box', () => {
  beforeEach(() => {
    document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
    });
    jest.useFakeTimers();
    client.query.mockResolvedValue({
      data: { participantIdSuggestions: ['PART-001', 'PART-002'] },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    client.query.mockReset();
  });

  it('does not load every id when the box opens', () => {
    render(<ParticipantIdSearchBox />);

    expect(queryNames().join('\n')).not.toContain('idsLists');
    expect(client.query).not.toHaveBeenCalled();
  });

  it('does not search a one character prefix', async () => {
    render(<ParticipantIdSearchBox />);

    fireEvent.change(searchInput(), {
      target: { value: 'P' },
    });
    await flushDebounce();

    expect(client.query).not.toHaveBeenCalled();
  });

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
