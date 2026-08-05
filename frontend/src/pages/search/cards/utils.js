export function encodeSubjectIds(subjectIdsArray) {
  const autocompleteArray = subjectIdsArray.map((subjectId) => {
    return {
      "type": "subjectIds",
      "title": subjectId,
    }
  });
  
  return encodeURIComponent(JSON.stringify({"autocomplete": autocompleteArray}));
}

/**
 * Encode protocol IDs as an Explore facet path filter.
 * Must be a facet object (not localFind autocomplete) so DashTemplateController
 * passes them as protocol_pk_ids to searchSubjects — autocomplete titles are
 * always mapped to subject_ids.
 *
 * Pair with ?selectedTab=protocols so Explore opens the Protocols tab and
 * runs protocolOverview (mapped to protocol_pk_id in DashTemplateController).
 *
 * Example URL payload: {"protocol_pk_ids":["114131145"]}
 */
export function encodeProtocolIds(protocolIdsArray) {
  const ids = Array.isArray(protocolIdsArray)
    ? protocolIdsArray
    : [protocolIdsArray].filter((id) => id != null && id !== '');
  return encodeURIComponent(JSON.stringify({ protocol_pk_ids: ids }));
}