import{r as R,j as e,H as $,L}from"./app-DTsHGxzA.js";import{c as k}from"./createLucideIcon-CC8irAo5.js";import{A as y}from"./award-odi01wEb.js";import{S as T,F as D}from"./user-check-CMo57ywq.js";import{U as H}from"./user-round-Duj3Ob52.js";import{G as I}from"./graduation-cap-ilOqGrxh.js";import{C as E}from"./calendar-days-BcUwFWP1.js";import{B as F}from"./AppLayout-ep6eKrMo.js";import{C as P}from"./circle-check-Cip0HJf9.js";const V=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],G=k("arrow-left",V);const Y=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],U=k("printer",Y);function re({bulletin:t,title:r="Bulletin scolaire",backHref:l,schoolName:d="LYCÉE PRIVÉ A.P.E"}){const n=t.student,x=t.trimestre,j=t.details||[],A=l||(typeof route<"u"?route("admin.bulletins.index"):"#"),z=x?.school_year?.year||x?.schoolYear?.year||t?.school_year?.year||t?.schoolYear?.year||"-",g=[n?.classe?.name,n?.serie?.name?`Série ${n.serie.name}`:null,n?.section?.name?`Section ${n.section.name}`:null].filter(Boolean).join(" - "),m=x?.name||x?.title||"Trimestre",a=R.useMemo(()=>[...j].sort((s,i)=>{const S=s.subject?.name||"",_=i.subject?.name||"";return S.localeCompare(_,"fr",{sensitivity:"base"})}),[j]),N=a.reduce((s,i)=>s+Number(i.coefficient||0),0),B=a.reduce((s,i)=>s+Number(i.weighted_average||0),0),b=w(t.moyenne),v=t.moyenne===null||t.moyenne===void 0?"-":Number(t.moyenne)>=10?"Admis":"À améliorer",C={"--print-scale":a.length>=24?"0.76":a.length>=20?"0.82":a.length>=16?"0.9":"1","--print-table-font":a.length>=20?"7px":a.length>=16?"8px":"9px","--print-cell-padding":a.length>=16?"1px":"2px","--print-signature-height":a.length>=18?"44px":"60px"},M=()=>{window.print()};return e.jsxs(e.Fragment,{children:[e.jsx($,{title:r}),e.jsx("style",{children:`
                    @media print {
                        @page {
                            size: A4 landscape;
                            margin: 0;
                        }

                        html,
                        body {
                            width: 297mm !important;
                            height: 210mm !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            background: white !important;
                            overflow: hidden !important;
                        }

                        body {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }

                        body * {
                            visibility: hidden !important;
                        }

                        .bulletin-print-area,
                        .bulletin-print-area * {
                            visibility: visible !important;
                        }

                        .no-print {
                            display: none !important;
                            visibility: hidden !important;
                        }

                        .print-wrapper {
                            padding: 0 !important;
                            margin: 0 !important;
                            width: 297mm !important;
                            height: 210mm !important;
                            overflow: hidden !important;
                            background: white !important;
                        }

                        .bulletin-print-area {
                            position: fixed !important;
                            inset: 0 !important;
                            width: 297mm !important;
                            height: 210mm !important;
                            padding: 5mm !important;
                            margin: 0 !important;
                            box-sizing: border-box !important;
                            background: white !important;
                            overflow: hidden !important;
                            display: flex !important;
                            align-items: flex-start !important;
                            justify-content: center !important;
                        }

                        .bulletin-paper {
                            width: 287mm !important;
                            height: 200mm !important;
                            max-width: none !important;
                            max-height: 200mm !important;
                            margin: 0 auto !important;
                            box-shadow: none !important;
                            border-radius: 0 !important;
                            border: 2px solid #000 !important;
                            overflow: hidden !important;
                            transform: scale(var(--print-scale)) !important;
                            transform-origin: top center !important;
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }

                        .print-text-black {
                            color: #000 !important;
                        }

                        .print-compact-table {
                            font-size: var(--print-table-font) !important;
                        }

                        .print-compact-table th,
                        .print-compact-table td {
                            padding-top: var(--print-cell-padding) !important;
                            padding-bottom: var(--print-cell-padding) !important;
                            line-height: 1.05 !important;
                        }

                        .print-signature-box {
                            min-height: var(--print-signature-height) !important;
                        }
                    }
                `}),e.jsxs("div",{className:"print-wrapper space-y-6",children:[e.jsxs("div",{className:"no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",children:[e.jsxs(L,{href:A,className:"inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 font-bold text-slate-600 transition hover:bg-slate-200",children:[e.jsx(G,{size:18}),"Retour"]}),e.jsxs("button",{type:"button",onClick:M,className:"inline-flex w-fit items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700",children:[e.jsx(U,{size:18}),"Imprimer seulement le bulletin"]})]}),e.jsx("div",{className:"no-print rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-violet-700 p-6 text-white shadow-xl",children:e.jsxs("div",{className:"flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold",children:[e.jsx(y,{size:18}),"Aperçu du bulletin trimestriel"]}),e.jsx("h1",{className:"text-3xl font-black",children:n?.user?.name||"Élève"}),e.jsxs("p",{className:"mt-2 text-white/80",children:[g||"Classe non définie"," —"," ",m]})]}),e.jsxs("div",{className:"rounded-3xl bg-white/15 p-5 text-center",children:[e.jsx("p",{className:"text-sm font-semibold text-white/80",children:"Moyenne du trimestre"}),e.jsxs("p",{className:"text-4xl font-black",children:[c(t.moyenne),"/20"]}),e.jsxs("p",{className:"mt-1 text-sm font-bold text-white/80",children:["Rang : ",t.rang||"-"]})]})]})}),e.jsx("div",{className:"bulletin-print-area",children:e.jsxs("div",{className:"bulletin-paper mx-auto max-w-[1180px] overflow-hidden rounded-2xl border-2 border-slate-900 bg-white shadow-2xl",style:C,children:[e.jsx("div",{className:"border-b-2 border-slate-900",children:e.jsxs("div",{className:"grid grid-cols-[1fr_2fr_1fr]",children:[e.jsxs("div",{className:"border-r-2 border-slate-900 p-3",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-700",children:e.jsx(T,{size:27})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-[10px] font-bold uppercase text-slate-500",children:"Établissement"}),e.jsx("p",{className:"text-base font-black uppercase text-slate-900",children:d})]})]}),e.jsxs("p",{className:"mt-2 text-xs font-semibold text-slate-500",children:["Année scolaire :"," ",e.jsx("span",{className:"font-black text-slate-900",children:z})]})]}),e.jsxs("div",{className:"flex flex-col items-center justify-center p-3 text-center",children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-[0.35em] text-slate-500",children:d}),e.jsx("h1",{className:"mt-1 text-3xl font-black uppercase tracking-wide text-slate-900",children:"Bulletin de notes"}),e.jsx("p",{className:"mt-1 text-xs font-black uppercase text-slate-700",children:m})]}),e.jsx("div",{className:"border-l-2 border-slate-900 p-3",children:e.jsxs("div",{className:"rounded-xl border border-slate-300 p-2 text-center",children:[e.jsx("p",{className:"text-[10px] font-bold uppercase text-slate-500",children:"Moyenne trimestrielle"}),e.jsx("p",{className:"mt-1 text-3xl font-black text-blue-700 print-text-black",children:c(t.moyenne)}),e.jsx("p",{className:"text-xs font-bold text-slate-500",children:"/20"})]})})]})}),e.jsxs("div",{className:"grid grid-cols-4 border-b-2 border-slate-900 text-xs",children:[e.jsx(p,{icon:e.jsx(H,{size:16}),label:"Nom et prénom",value:n?.user?.name||"-"}),e.jsx(p,{icon:e.jsx(D,{size:16}),label:"Matricule",value:n?.matricule||"-"}),e.jsx(p,{icon:e.jsx(I,{size:16}),label:"Classe",value:g||"-"}),e.jsx(p,{icon:e.jsx(E,{size:16}),label:"Trimestre",value:m,last:!0})]}),e.jsxs("div",{className:"grid grid-cols-4 border-b-2 border-slate-900",children:[e.jsx(o,{label:"Moyenne",value:`${c(t.moyenne)}/20`}),e.jsx(o,{label:"Rang",value:t.rang||"-"}),e.jsx(o,{label:"Appréciation",value:b}),e.jsx(o,{label:"Décision",value:v,last:!0})]}),e.jsx("div",{className:"p-3",children:e.jsxs("table",{className:"print-compact-table w-full border-collapse text-xs",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-slate-100",children:[e.jsx("th",{className:"border border-slate-900 px-2 py-1 text-center font-black uppercase",children:"N°"}),e.jsx("th",{className:"border border-slate-900 px-2 py-1 text-left font-black uppercase",children:"Matières"}),e.jsx("th",{className:"border border-slate-900 px-2 py-1 text-center font-black uppercase",children:"Coef."}),e.jsx("th",{className:"border border-slate-900 px-2 py-1 text-center font-black uppercase",children:"Moyenne /20"}),e.jsx("th",{className:"border border-slate-900 px-2 py-1 text-center font-black uppercase",children:"Moy. coeff."}),e.jsx("th",{className:"border border-slate-900 px-2 py-1 text-center font-black uppercase",children:"Appréciation"})]})}),e.jsxs("tbody",{children:[a.map((s,i)=>e.jsxs("tr",{children:[e.jsx("td",{className:"border border-slate-900 px-2 py-1 text-center font-bold text-slate-700",children:i+1}),e.jsx("td",{className:"border border-slate-900 px-2 py-1 font-bold uppercase text-slate-900",children:s.subject?.name||"-"}),e.jsx("td",{className:"border border-slate-900 px-2 py-1 text-center font-bold",children:s.coefficient||1}),e.jsx("td",{className:"border border-slate-900 px-2 py-1 text-center font-black text-blue-700 print-text-black",children:c(s.average)}),e.jsx("td",{className:"border border-slate-900 px-2 py-1 text-center font-black text-emerald-700 print-text-black",children:c(s.weighted_average)}),e.jsx("td",{className:"border border-slate-900 px-2 py-1 text-center font-bold",children:s.appreciation||w(s.average)})]},s.id||i)),a.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"6",className:"border border-slate-900 px-3 py-8 text-center font-bold text-slate-500",children:"Aucun détail disponible."})}),e.jsxs("tr",{className:"bg-slate-100",children:[e.jsx("td",{colSpan:"2",className:"border border-slate-900 px-2 py-1 text-right font-black uppercase",children:"Total"}),e.jsx("td",{className:"border border-slate-900 px-2 py-1 text-center font-black",children:N}),e.jsx("td",{className:"border border-slate-900 px-2 py-1 text-center font-black",children:"-"}),e.jsx("td",{className:"border border-slate-900 px-2 py-1 text-center font-black",children:c(B)}),e.jsx("td",{className:"border border-slate-900 px-2 py-1 text-center font-black",children:b})]})]})]})}),e.jsxs("div",{className:"grid grid-cols-4 border-y-2 border-slate-900",children:[e.jsx(o,{label:"Total coefficients",value:N}),e.jsx(o,{label:"Moyenne trimestrielle",value:`${c(t.moyenne)}/20`}),e.jsx(o,{label:"Rang",value:t.rang||"-"}),e.jsx(o,{label:"Décision",value:v,last:!0})]}),e.jsxs("div",{className:"grid grid-cols-3 border-b-2 border-slate-900",children:[e.jsx(h,{label:"Absence",value:"-"}),e.jsx(h,{label:"Retard",value:"-"}),e.jsx(h,{label:"Conduite",value:"-",last:!0})]}),e.jsxs("div",{className:"grid grid-cols-3",children:[e.jsx(u,{title:"Appréciations du conseil"}),e.jsx(u,{title:"Signature des parents"}),e.jsx(u,{title:"Le Directeur / Responsable",last:!0})]})]})}),e.jsxs("div",{className:"no-print grid gap-5 md:grid-cols-3",children:[e.jsx(f,{icon:e.jsx(F,{size:22}),label:"Matières évaluées",value:a.length,color:"blue"}),e.jsx(f,{icon:e.jsx(P,{size:22}),label:"Appréciation",value:b,color:"emerald"}),e.jsx(f,{icon:e.jsx(y,{size:22}),label:"Rang",value:t.rang||"-",color:"violet"})]})]})]})}function p({icon:t,label:r,value:l,last:d=!1}){return e.jsxs("div",{className:`flex items-center gap-2 p-2 ${d?"":"border-r-2 border-slate-900"}`,children:[e.jsx("div",{className:"flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700",children:t}),e.jsxs("div",{children:[e.jsx("p",{className:"text-[10px] font-bold uppercase text-slate-500",children:r}),e.jsx("p",{className:"font-black uppercase text-slate-900",children:l})]})]})}function o({label:t,value:r,last:l=!1}){return e.jsxs("div",{className:`p-2 text-center ${l?"":"border-r-2 border-slate-900"}`,children:[e.jsx("p",{className:"text-[10px] font-black uppercase text-slate-500",children:t}),e.jsx("p",{className:"mt-1 text-lg font-black text-slate-900",children:r})]})}function h({label:t,value:r,last:l=!1}){return e.jsxs("div",{className:`p-2 text-center ${l?"":"border-r-2 border-slate-900"}`,children:[e.jsx("p",{className:"text-[10px] font-black uppercase text-slate-500",children:t}),e.jsx("p",{className:"mt-1 text-sm font-black text-slate-900",children:r})]})}function u({title:t,last:r=!1}){return e.jsxs("div",{className:`print-signature-box min-h-[60px] p-2 ${r?"":"border-r-2 border-slate-900"}`,children:[e.jsx("p",{className:"text-center text-xs font-black uppercase text-slate-700",children:t}),e.jsx("div",{className:"mt-6 border-t border-dashed border-slate-400 pt-1 text-center text-[10px] font-semibold text-slate-400",children:"Signature"})]})}function f({icon:t,label:r,value:l,color:d}){const n={blue:"bg-blue-50 text-blue-600",emerald:"bg-emerald-50 text-emerald-600",violet:"bg-violet-50 text-violet-600"};return e.jsx("div",{className:"rounded-3xl border border-slate-200 bg-white p-6 shadow-sm",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:`flex h-12 w-12 items-center justify-center rounded-2xl ${n[d]||n.blue}`,children:t}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold text-slate-500",children:r}),e.jsx("p",{className:"text-2xl font-black text-slate-800",children:l})]})]})})}function c(t){if(t==null||t==="")return"-";const r=Number(t);return Number.isNaN(r)?t:r.toFixed(2)}function w(t){const r=Number(t);return Number.isNaN(r)?"-":r>=16?"Très bien":r>=14?"Bien":r>=12?"Assez bien":r>=10?"Passable":"Insuffisant"}export{re as B};
