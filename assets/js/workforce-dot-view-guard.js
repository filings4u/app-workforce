import {supabase} from './supabase.js?v=20260916-auth-isolation-v4';
const deny=(reason)=>{document.body.replaceChildren();document.body.style.visibility='visible';const main=document.createElement('main');main.style.cssText='max-width:680px;margin:12vh auto;padding:28px;font-family:Arial,sans-serif';const h=document.createElement('h1');h.textContent='DOT program access required';const p=document.createElement('p');p.textContent=reason;const link=document.createElement('a');link.href='../workspace-select.html';link.textContent='Select another workspace';main.append(h,p,link);document.body.append(main)};
(async()=>{try{
 const {data:{session},error:se}=await supabase.auth.getSession();
 if(se||!session)return deny('Sign in to your authorized Workforce account.');
 const {data:ctx,error:ce}=await supabase.functions.invoke('workforce-session-context',{body:{requested_portal:'ctpa'}});
 if(ce||!ctx?.has_access||ctx.requires_workspace_selection||ctx.portal!=='ctpa')return deny('An active C/TPA workspace is required.');
 const org=String(ctx.membership?.organization_id||ctx.organization?.id||ctx.organization_id||'');
 if(!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(org))return deny('The organization could not be verified.');
 const {data:policy,error:pe}=await supabase.functions.invoke('workforce-access-policy',{body:{organization_id:org}});
 if(pe||!policy?.access_granted||!policy.effective_programs?.includes('DOT')||!policy.effective_portals?.includes('ctpa_workforce'))return deny('Your current subscription does not include this DOT workspace.');
 document.querySelector('#dot-view-privacy')?.remove();document.body.style.visibility='visible';
 }catch{return deny('Unable to verify DOT permission. Please sign in again.')}}
)();
