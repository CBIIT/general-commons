package gov.nih.nci.bento_ri.model;

import lombok.Getter;

import java.util.Map;

@Getter
public class AssociatedFile {

    private final String fileId;
    private final String fileName;
    private final String uri;
    private final String md5sum;

    AssociatedFile(Map<String, Object> fileData){
        this.fileId = getStringOrNotSpecified(fileData.get("file_id"));
        this.fileName = getStringOrNotSpecified(fileData.get("file_name"));
        this.uri = getStringOrNotSpecified(fileData.get("uri"));
        this.md5sum = getStringOrNotSpecified(fileData.get("md5sum"));
    }

    private String getStringOrNotSpecified(Object obj){
        return (obj instanceof String) ? (String) obj : "Not specified in data";
    }
}


