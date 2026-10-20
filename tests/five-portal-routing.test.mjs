import assert from 'node:assert/strict';
import {resolveWorkspaceRole,agencyFromPortal,dashboardPath,workspaceForEntitlements,agencies} from '../assets/js/workforce-five-portal-routing.js';
assert.deepEqual([...agencies],['FMCSA','FAA','FRA','FTA','PHMSA','USCG']);
for(const agency of agencies){
 const key=agency.toLowerCase();
 assert.equal(resolveWorkspaceRole(key+'_dot'),'employer');
 assert.equal(resolveWorkspaceRole(key+'_employer_dot'),'employer');
 assert.equal(resolveWorkspaceRole(key+'_employee_dot'),'employee');
 assert.equal(agencyFromPortal(key+'_dot'),agency);
 assert.equal(workspaceForEntitlements({portal_code:key+'_dot',purchased_program:'NON_DOT',granted_roles:['employer']}),null);
 assert.equal(workspaceForEntitlements({portal_code:key+'_dot',purchased_program:'DOT',assigned_agency:agency,granted_roles:['employer']})?.path,'/employer/dashboard.html');
}
for(const role of ['ctpa','employer','owner_operator','employee','driver'])assert.ok(dashboardPath(role));
assert.equal(resolveWorkspaceRole('ctpa_driver_dot'),'driver');
assert.equal(resolveWorkspaceRole('ctpa_employee_workforce'),'employee');
assert.equal(resolveWorkspaceRole('ctpa_employer_workforce'),'employer');
assert.equal(workspaceForEntitlements({portal_code:'owner_operator',purchased_program:'DOT',granted_roles:['owner_operator']}),null);
assert.equal(workspaceForEntitlements({portal_code:'employer_workforce',purchased_program:'NON_DOT',granted_roles:['employer']})?.role,'employer');
console.log('Five-portal routing and DOT agency entitlement checks passed.');
