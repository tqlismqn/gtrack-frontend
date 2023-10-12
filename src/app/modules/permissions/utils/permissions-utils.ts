import {
  PermissionModule,
  PermissionModuleResponse,
} from '../types/permissions.type';

export class PermissionsUtils {
  public static permissionResponseToDTO(
    item: PermissionModuleResponse,
  ): PermissionModule {
    return {
      ...item,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at),
    };
  }
}
