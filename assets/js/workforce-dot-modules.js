import {supabase} from './supabase.js?v=20260916-auth-isolation-v4';
const role=location.pathname.includes('/ctpa/')?'ctpa':'employer';
const status=document.querySelector('#dotStatus'),container=document.querySelector('#dotModules');
(async()=>{try{
 const {data:{session}}=await supabase.auth.getSession();if(!session)throw Error('Sign in to continue.');
 const {data:ctx,error:e1}=await supabase.functions.invoke('workforce-session-context',{body:{requested_portal:role}});
 if(e1||!ctx?.has_access||ctx.requires_workspace_selection)throw Error('Workspace access unavailable.');
 const org=ctx.membership?.organization_id||ctx.organization?.id||ctx.organization_id;
 if(!/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(String(org||'')))throw Error('Organization not verified.');
 const {data:p,error:e2}=await supabase.functions.invoke('workforce-access-policy',{body:{organization_id:org}});
 if(e2||!p?.access_granted||!p.effective_programs?.includes('DOT'))throw Error('DOT access denied.');
 const agencies=['FMCSA','FAA','FRA','FTA','PHMSA','USCG'];
 const allowed=role==='ctpa'?agencies:agencies.filter(a=>p.subscriptions?.some(s=>s.agency===a));
 if(!allowed.length)throw Error('DOT agency assignment is required.');
 const list=document.querySelector('#dotAgencyList');
 const modules=[
  {label:'Compliance Overview',url:'compliance.html',description:'Open compliance tracking'},
  {label:'DOT Programs',url:'programs.html',description:'Review program enrollment and management'},
  {label:'Clearinghouse',url:'clearinghouse.html',description:'Open clearinghouse workflow'},
  ...(role==='employer'?[{label:'Driver Qualification',url:'driver-qualification.html',description:'Review driver qualification files'}]:[])
 ];
 for(const agency of allowed){
  const section=document.createElement('section');section.className='card';section.style.padding='18px';section.style.margin='12px 0';
  const heading=document.createElement('h3');heading.textContent=agency+' DOT';section.append(heading);
  const body=document.createElement('div');body.style.display='grid';body.style.gridTemplateColumns='repeat(auto-fit,minmax(210px,1fr))';body.style.gap='12px';
  for(const module of modules){
   const link=document.createElement('a');link.href=module.url;link.className='btn btn-outline';
   link.style.display='block';link.style.padding='16px';link.textContent=module.label;
   link.title=module.description;body.append(link);
  }
  section.append(body);list.append(section);
 }
 status.textContent='DOT access verified';container.hidden=false;
 }catch(e){status.textContent=e?.message||'Access denied';status.setAttribute('role','alert')}})();