export interface CustomerFollowUP {
    Name: string;
    Label: string;
    Info: string;
    Fields: Array<FollowUpFields>;
    AllocatedTime: string;
}


export interface FollowUpFields {
    Name: string;
    Label: string;
    Questions: Array<Question>;
    Type: string;
}


export interface Question {
    Name: string;
    Answer: string | null;
    Type: string;
    Label: string;
    IsRequired: boolean;
    MoveToFollowUp: boolean;
    Documents: Array<FollowUpDocuments>;
    Links: Array<FollowUpLinks>;
}


export interface FollowUpDocuments {
    FileFullPath: string;
    FileName: string;
    FileSize: number;
    FileSubPath: string;
    FileType: string;
    Id: number;
}

export interface FollowUpLinks {
    Link: string;
    Id: number;
}