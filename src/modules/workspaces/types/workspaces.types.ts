import {EDatabaseType} from "@/modules/document-view";

export interface IWorkspaceInitResponse {
    workspaceId: string;
    initializedModules: string[];
    createdRelations: string[];
    sampleDataCreated: boolean;
    errors: string[];
}

export type TModuleInitializeRequest = {
    workspaceId: string;
    moduleTypes: EDatabaseType[];
    createSampleData: boolean;
    isInitialized: boolean
}