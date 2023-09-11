export class CustomerDelivery {
    id?: number;
    customerName: string;
    customerEmail: string;
    model: CommonModel;
    deliveryDate?: string;
    deliveryTime?: string;
    contactNumber: string;
    porschePro: CommonModel;
    salesConsultant: CommonModel;
    serviceAdvisor: CommonModel;
    deliveryType: CommonModel;
    customerId?: number;
    isSurveySent?: boolean;
    skipSurvey?: boolean;
    centreName?: string;
    deliveryStatus: number;
    constructor() { }
}

export class CommonModel {
    id: number;
    name: string;
    imagePath?: string;
    base64Image?: string;
}
