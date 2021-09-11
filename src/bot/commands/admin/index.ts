import { PermissionSetHandler } from "./permissionSet";
import { PermissionSetAllowHandler } from "./permissionSet.allow";
import { PermissionSetCreateHandler } from "./permissionSet.create";
import { PermissionSetListHandler } from "./permissionSet.list";

const adminCommands: Function[] = [
    PermissionSetHandler,
    PermissionSetCreateHandler,
    PermissionSetListHandler,
    PermissionSetAllowHandler
];

export default adminCommands;