export enum PERMISSIONS {
    ALL = 'all',
    READ_DASHBOARD = 'view_dashboard',
    READ_REPORTS = 'view_reports',
    READ_NOTIFICATION = 'view_notification',
    READ_INSPECTORS = 'view_inspectors',
    READ_CRITERIA = 'view_criteria',
    SIGN_CRITERIA = 'sign_criteria',
    READ_REGISTRY = 'view_registry',
    READ_USER_CONTROL = 'view_user_control',
}

export enum LICENSE_STATUS {
    ACTIVE = 'ACTIVE',
    CANCELED = 'CANCELED',
    CHANGED = 'CHANGED',
    EXPIRED = 'EXPIRED',
    NOT_PAID = 'NOT_PAID',
    SUSPENDED = 'SUSPENDED',
    SUSPEND_PROCESS = 'SUSPEND_PROCESS',
    TERMINATED = 'TERMINATED',
}

export enum USER_PERMISSIONS {
    VIEW_DASHBOARD = 'view_dashboard',
    CHANGE_DASHBOARD = 'change_dashboard',
    ADD_DASHBOARD = 'add_dashboard',
    DELETE_DASHBOARD = 'delete_dashboard',
    SIGN_DASHBOARD = 'sign_dashboard',

    VIEW_USER_CONTROL = 'view_user_control',
    CHANGE_USER_CONTROL = 'change_user_control',
    ADD_USER_CONTROL = 'add_user_control',
    DELETE_USER_CONTROL = 'delete_user_control',
    SIGN_USER_CONTROL = 'sign_user_control',

    VIEW_REGISTRY = 'view_registry',
    CHANGE_REGISTRY = 'change_registry',
    ADD_REGISTRY = 'add_registry',
    DELETE_REGISTRY = 'delete_registry',
    SIGN_REGISTRY = 'sign_registry',

    VIEW_COMPANY_EVALUATION = 'view_company_evaluation',
    CHANGE_COMPANY_EVALUATION = 'change_company_evaluation',
    ADD_COMPANY_EVALUATION = 'add_company_evaluation',
    DELETE_COMPANY_EVALUATION = 'delete_company_evaluation',
    SIGN_COMPANY_EVALUATION = 'sign_company_evaluation',

    VIEW_CRITERIA = 'view_criteria',
    CHANGE_CRITERIA = 'change_criteria',
    ADD_CRITERIA = 'add_criteria',
    DELETE_CRITERIA = 'delete_criteria',
    SIGN_CRITERIA = 'sign_criteria',

    VIEW_INSPECTORS = 'view_inspectors',
    CHANGE_INSPECTORS = 'change_inspectors',
    ADD_INSPECTORS = 'add_inspectors',
    DELETE_INSPECTORS = 'delete_inspectors',
    SIGN_INSPECTORS = 'sign_inspectors',

    VIEW_NOTIFICATION = 'view_notification',
    CHANGE_NOTIFICATION = 'change_notification',
    ADD_NOTIFICATION = 'add_notification',
    DELETE_NOTIFICATION = 'delete_notification',
    SIGN_NOTIFICATION = 'sign_notification',

    VIEW_REPORTS = 'view_reports',
    CHANGE_REPORTS = 'change_reports',
    ADD_REPORTS = 'add_reports',
    DELETE_REPORTS = 'delete_reports',
    SIGN_REPORTS = 'sign_reports',

    VIEW_LOGS = 'view_logs',
    CHANGE_LOGS = 'change_logs',
    ADD_LOGS = 'add_logs',
    DELETE_LOGS = 'delete_logs',

    VIEW_SYSTEM_MONITORING = 'view_system_monitoring',

    NO_ENTRY = 'no_entry',
    ALL = 'all'
}

export enum ROLES {
    ADMIN = 'admin',
    MONITORING = 'monitoring',
    INSPECTOR = 'inspector',
    SIGNER = 'signer',
}

export enum MESSAGE_STATUS {
    NEW = 'new',
    SENT_TO_SIGNER = "sent_to_signer",
    SIGNED = "signed",
    REJECTED = "rejected"
}