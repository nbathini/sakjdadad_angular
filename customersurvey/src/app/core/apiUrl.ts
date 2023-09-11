export const ApiUrl = {
  auth: {
    login: 'Auth/Login',
    pclLogin:'Auth/ValidatePPNUserAccess',
    forgotPassword: 'Auth/ForgotPassword',
    changePassword: 'Auth/ChangePassword',
    resetPassword: 'Auth/ResetPassword ',
  },
  admin: {
    login: 'admin/Auth/Login',
    resetPassword: 'admin/Auth/ResetPassword ',
    forgotPassword: 'admin/Auth/ForgotPassword',
    changePassword: 'admin/Auth/ChangePassword',
    center: 'admin/Centre',
    audit: 'admin/AuditLog',
    auditAll: 'admin/AuditLog/GetAll',
    staff: 'admin/Staff',
    designation: 'admin/Auth/Designation',
    getDocuments: 'admin/Document/CheckList',
    documents: 'admin/Document',
    externalLink: 'admin/Link',
    masterData:{
      carmodel: 'admin/CarModel',
    },
    role: 'admin/RoleModule',
    managechecklist:'admin/document/managechecklist'
  },
  dealer: {
    delivery: 'Delivery',
    getCarModels: 'Delivery/CarModel',
    getConsultants: 'Delivery/Consultant',
    getPorschePros: 'Delivery/PorschePro',
    getAdvisors: 'Delivery/Advisor',
    getDeliveryTypes: 'Delivery/Type',
  },
  survey: {
    customerSurvey: 'Survey/CustomerSurvey',
    getDeliveryPreparation: 'Survey/DeliveryPreparation',
    submitCustomerResponse: 'Survey/CustomerResponse',
    infoSheetInformation: 'Survey/InfoSheetInformation',
    preDeliveryChecklist: 'Survey/PreDeliveryChecklist',
    DeliveryChecklist: 'Survey/DeliveryChecklist',
    sendDocuments: 'Survey/SendDocuments'
  }
};
