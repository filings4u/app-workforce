import {supabase} from './supabase.js?v=20260916-auth-isolation-v4';
const landing=new URL('../../access-required.html?reason=dot-program',import.meta.url);
(async()=>{try{
 const {data:{session}}=await supabase.auth.getSession();if(!session)throw Error('Sign in required');
 const {data:ctx,error:ce}=await supabase.functions.invoke('workforce-session-context',{body:{requested_portal:'ctpa'}});
 if(ce||!ctx?.has_access||ctx.requires_workspace_selection||ctx.portal!=='ctpa')throw Error('Workspace denied');
 const org=ctx.membership?.organization_id||ctx.organization?.id||ctx.organization_id;
 if(!/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(String(org||'')))throw Error('Organization missing');
 const {data:p,error}=await supabase.functions.invoke('workforce-access-policy',{body:{organization_id:org}});
 if(error||!p?.access_granted||!p.effective_programs?.includes('DOT'))throw Error('DOT program not purchased');
 document.documentElement.dataset.dotAccess='granted';
 document.querySelector('#dot-access-pending')?.remove();
 }catch(e){console.warn('DOT view restricted',e);location.replace(landing.href)}})();
