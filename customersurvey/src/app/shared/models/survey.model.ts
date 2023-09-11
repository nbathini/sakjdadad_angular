export interface Survey {
    info: string;
    fields: Array<Fields>;
}

export interface Fields {
    type: string;
    question: string;
    answer: string | null;
    name: string;
    checked?: boolean;
    options?: Array<any>;
    is_required: boolean;
}

export interface CustomerSurvey {
    Name: string;
    Type: string;
    Answer: string | null;
    Question: string;
    IsVisible: boolean;
    IsInfoSheet: boolean;
    MinLabel?: string;
    MaxLabel?: string;
    Min?: string;
    Max?: string;
    Step?: string;
    Options?: Array<any>;
}
