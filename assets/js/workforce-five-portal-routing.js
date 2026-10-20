// Pure routing policy: six DOT agencies are modules, never standalone portal shells.
// The result is a route intention only; authenticated backend permission is required.
export const applicationOrigin='https://app-workforce.screenings4u.com';
export const agencies=Object.freeze(['FMCSA','FAA','FRA','FTA','PHMSA','USCG']);
const targets=Object.freeze({ctpa:'ctpa',employer:'employer',owner_operator:'owner-operator',employee:'employee',driver:'driver'});
export function resolveWorkspaceRole(code){
 const value=String(code||'').toLowerCase().replaceAll('-','_');
 if(value==='owner_operator'||value.startsWith('owner_operator_'))return 'owner_operator';
 if(value.startsWith('ctpa_driver')||value==='driver_dot'||value==='driver_workforce'||value.endsWith('_driver_dot')||value.endsWith('_driver_workforce'))return 'driver';
 if(value.startsWith('ctpa_employee')||value==='employee_dot'||value==='employee_workforce'||value.endsWith('_employee_dot')||value.endsWith('_employee_workforce'))return 'employee';
 if(value==='ctpa_dot'||value==='ctpa_workforce'||value.startsWith('dot_ctpa_'))return 'ctpa';
 if(value.startsWith('ctpa_employer')||value==='employer_dot'||value==='employer_workforce'||value.endsWith('_employer_dot')||value.endsWith('_employer_workforce')||value.startsWith('dot_employer_'))return 'employer';
 if(['fmcsa_dot','faa_dot','fra_dot','fta_dot','phmsa_dot','uscg_dot'].includes(value))return 'employer';
 return null;
}
export function agencyFromPortal(code){
 const value=String(code||'').toLowerCase().replaceAll('-','_');
 for(const agency of agencies)if(value===agency.toLowerCase()+'_dot'||value.startsWith(agency.toLowerCase()+'_'))return agency;
 return null;
}
export function dashboardPath(role){
 const part=targets[role];return part?'/'+part+'/dashboard.html':null;
}
export function workspaceForEntitlements({portal_code,purchased_program,assigned_agency,granted_roles=[]}={}){
 const role=resolveWorkspaceRole(portal_code);
 if(!role||!granted_roles.includes(role))return null;
 const program=String(purchased_program||'').toUpperCase();
 const agency=agencyFromPortal(portal_code);
 if(role==='owner_operator'&&program!=='OWNER_OPERATOR')return null;
 if(role!=='owner_operator'&&program==='OWNER_OPERATOR')return null;
 if(agency&&program!=='DOT'&&program!=='DOT_AND_NON_DOT')return null;
 if(agency&&assigned_agency&&agency!==String(assigned_agency).toUpperCase())return null;
 return Object.freeze({role,path:dashboardPath(role),agency,program});
}
