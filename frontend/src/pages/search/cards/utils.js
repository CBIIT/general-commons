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
export function encodeProtocolIds(protocolIds) {
  const ids = (Array.isArray(protocolIds) ? protocolIds : [protocolIds])
    .filter((id) => id != null && String(id).trim() !== '')
    .map((id) => String(id));
  return encodeURIComponent(JSON.stringify({ protocol_pk_ids: ids }));
}

/**
 * Encode file IDs as an Explore facet path filter.
 *
 * Pair with ?selectedTab=files so Explore opens the Files tab and
 * runs fileOverview (file_ids is a keyword on dashboard_file).
 *
 * Example URL payload: {"file_ids":["dg.4DFC/example"]}
 */
export function encodeFileIds(fileIds) {
  const ids = (Array.isArray(fileIds) ? fileIds : [fileIds])
    .filter((id) => id != null && String(id).trim() !== '')
    .map((id) => String(id));
  return encodeURIComponent(JSON.stringify({ file_ids: ids }));
}