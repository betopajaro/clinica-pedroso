import { useState, useEffect } from "react";

const db = {
  async get(key) { try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } catch { return null; } },
  async set(key, value) { try { await window.storage.set(key, JSON.stringify(value)); } catch {} }
};

// ─── DATA ─────────────────────────────────────────────────────────
const PHASES = [
  {
    id: "f0", tag: "FASE 0", label: "Diagnóstico", color: "#C9A96E", icon: "🔍",
    how: "Reúna o dentista-sócio/responsável e responda as perguntas abaixo com honestidade brutal. Não pule esta fase — ela evita gastar dinheiro na direção errada.",
    questions: [
      "Quem são seus 5 melhores pacientes hoje? O que eles têm em comum?",
      "Por que canal a maioria dos pacientes te encontrou?",
      "Qual tratamento gera mais receita? Qual dá mais margem?",
      "Se você fechar amanhã, o que os pacientes sentiriam falta?",
      "Quais são os 3 principais concorrentes diretos? O que eles fazem bem?",
      "Como está sua presença no Google Meu Negócio? Quantas avaliações tem?",
      "Qual é o seu ticket médio atual por paciente/ano?",
    ],
    tasks: [
      { id:"f0t1", label:"Responder as 7 perguntas de diagnóstico por escrito", deliverable:"Documento de diagnóstico (1-2 páginas)" },
      { id:"f0t2", label:"Fazer SWOT: listar 4 forças, 4 fraquezas, 4 oportunidades, 4 ameaças", deliverable:"SWOT preenchida" },
      { id:"f0t3", label:"Mapear 3-5 concorrentes no Maps e anotar posicionamento deles", deliverable:"Tabela comparativa de concorrentes" },
      { id:"f0t4", label:"Auditar presença digital atual (Instagram, Google, site, WhatsApp)", deliverable:"Nota de 0-10 em cada canal + o que falta" },
      { id:"f0t5", label:"Entrevistar 3 pacientes atuais (por WhatsApp ou pessoalmente)", deliverable:"3 depoimentos + insights sobre motivo de escolha" },
    ],
    tools: ["Google Forms para entrevistas", "Google Maps para análise de concorrentes", "Notion ou papel — o que for usar"],
    duration: "1–2 semanas",
  },
  {
    id: "f1", tag: "FASE 1", label: "Propósito & Alma", color: "#E8C547", icon: "💡",
    how: "Sessão de 2–3 horas com o fundador. Use as perguntas para extrair o WHY real — geralmente não é óbvio de cara. O propósito verdadeiro aparece na 3ª ou 4ª resposta.",
    questions: [
      "Por que você virou dentista? Qual foi o momento que decidiu?",
      "Qual caso clínico te deu mais satisfação e por quê?",
      "Se dinheiro não fosse problema, você ainda faria isso? O que mudaria?",
      "O que te irrita no jeito que a maioria dos consultórios trata pacientes?",
      "Em 10 anos, o que você quer que as pessoas falem do seu consultório?",
    ],
    tasks: [
      { id:"f1t1", label:"Responder as 5 perguntas de propósito (sem pensar, só sentindo)", deliverable:"Rascunho do WHY pessoal" },
      { id:"f1t2", label:"Escrever o Golden Circle: WHY (1 frase) / HOW (2-3 frases) / WHAT (1 frase)", deliverable:"Golden Circle finalizado" },
      { id:"f1t3", label:"Escrever o Manifesto da marca (1 parágrafo que emociona)", deliverable:"Manifesto pronto para revisão" },
      { id:"f1t4", label:"Definir 3-5 valores inegociáveis com exemplos práticos de cada", deliverable:"Cartão de valores (para exibir na recepção e usar no onboarding da equipe)" },
    ],
    tools: ["Sessão gravada no celular (para não perder nenhuma fala)", "Notion ou Word para escrever", "Pode pedir à Claude para ajudar a refinar o manifesto"],
    duration: "1 semana",
  },
  {
    id: "f2", tag: "FASE 2", label: "Posicionamento", color: "#E87347", icon: "🎯",
    how: "Esta é a decisão mais importante de toda a estratégia. Não tente agradar todo mundo — isso é a receita do anonimato em SP. Quanto mais específico o nicho, mais fácil escalar.",
    questions: [
      "Se você pudesse atender APENAS um perfil de paciente, quem seria?",
      "Qual tratamento você faz melhor que qualquer vizinho de bairro?",
      "Em qual palavra ou frase você quer ser lembrado em SP?",
      "O que você oferece que nenhum concorrente direto oferece?",
      "Você prefere ser: mais acessível e volume / ou mais premium e exclusivo?",
    ],
    tasks: [
      { id:"f2t1", label:"Criar mapa perceptual: plotar concorrentes em 2 eixos (ex: popular↔premium / frio↔humanizado)", deliverable:"Mapa visual com espaço vazio identificado" },
      { id:"f2t2", label:"Definir o nicho: público-alvo em 1 frase específica", deliverable:"ICP — Ideal Customer Profile do consultório" },
      { id:"f2t3", label:"Escrever a Proposta Única de Valor (PUV) em 1 frase", deliverable:"PUV validada" },
      { id:"f2t4", label:"Definir a 'palavra que você quer possuir' na mente do paciente", deliverable:"1 palavra ou conceito central de posicionamento" },
    ],
    tools: ["Miro ou papel para mapa perceptual", "Pesquisar perfil do Instagram de concorrentes", "Claude pode ajudar a refinar a PUV com variações"],
    duration: "1 semana",
  },
  {
    id: "f3", tag: "FASE 3", label: "Narrativa StoryBrand", color: "#7EC8A4", icon: "📖",
    how: "Com base no posicionamento, construir o script de comunicação. TUDO que você publicar — post, stories, site, WhatsApp — vai seguir esta estrutura. É o DNA da comunicação.",
    questions: [
      "Qual é o maior medo/insegurança que seu paciente ideal tem (não o problema físico, o emocional)?",
      "O que muda na vida do paciente depois do tratamento com você?",
      "Por que você é o guia certo para essa jornada? Qual sua credencial humana?",
      "Como seria a vida do paciente se ele NÃO resolver o sorriso? (fracasso evitado)",
      "Qual é o primeiro passo mais simples que o paciente pode dar agora?",
    ],
    tasks: [
      { id:"f3t1", label:"Preencher o framework SB7 completo", deliverable:"SB7 preenchido: herói, problema, guia, plano, ação, sucesso, fracasso evitado" },
      { id:"f3t2", label:"Escrever a logline da marca (1 frase que conta a história completa)", deliverable:"Logline para usar em bio, apresentações e site" },
      { id:"f3t3", label:"Escrever Os 3 Passos da jornada do paciente", deliverable:"Passo 1, 2, 3 — simples o suficiente para qualquer paciente entender" },
      { id:"f3t4", label:"Criar script-modelo para posts (problema → solução → resultado)", deliverable:"Template de post para a equipe de social media usar" },
      { id:"f3t5", label:"Reescrever a bio do Instagram usando a lógica StoryBrand", deliverable:"Nova bio do Instagram" },
    ],
    tools: ["Planilha do SB7 (posso gerar)", "Notion para templates de conteúdo"],
    duration: "1–2 semanas",
  },
  {
    id: "f4", tag: "FASE 4", label: "Identidade Visual", color: "#9B8FE8", icon: "🎨",
    how: "Contratar um designer ou agência para executar, mas com o briefing 100% preenchido por você. Nunca deixe o designer definir o posicionamento — isso é seu. Ele executa, você direciona.",
    questions: [
      "3 marcas (de qualquer setor) que você admira esteticamente — por quê?",
      "Sua marca é mais: clínica/técnica ou quente/humanizada?",
      "Qual cor você definitivamente NÃO quer? (importante tanto quanto o que quer)",
      "Como você quer que o paciente se sinta ao ver sua marca pela primeira vez?",
    ],
    tasks: [
      { id:"f4t1", label:"Preencher o Brand Essence Card (atributos, benefícios, valores, personalidade, essência)", deliverable:"Brand Essence Card — briefing para o designer" },
      { id:"f4t2", label:"Criar moodboard com referências visuais", deliverable:"Pasta no Pinterest ou Canva com 20-30 referências" },
      { id:"f4t3", label:"Contratar designer/agência e passar o briefing", deliverable:"Proposta de identidade visual (logo, cores, tipografia)" },
      { id:"f4t4", label:"Mapear todos os touchpoints e aplicar identidade em cada um", deliverable:"Checklist de touchpoints: WhatsApp, Instagram, receituário, uniforme, ambiente" },
      { id:"f4t5", label:"Criar Brandbook simplificado para a equipe", deliverable:"PDF de 5-10 páginas com guia de uso da marca" },
    ],
    tools: ["Canva (moodboard)", "Pinterest (referências)", "Contratar via 99designs, Workana, ou agência local"],
    duration: "3–6 semanas (depende do designer)",
  },
  {
    id: "f5", tag: "FASE 5", label: "Oferta Irresistível", color: "#E85D75", icon: "💎",
    how: "Revisitar cada serviço e construir a oferta do zero. A oferta é o que separa 'tenho interesse' de 'quero marcar agora'. Faça o paciente sentir que seria idiota não agendar.",
    questions: [
      "Qual é o maior obstáculo que impede alguém de agendar? (preço, medo, tempo, desconfiança?)",
      "O que você poderia adicionar ao tratamento que custaria pouco para você mas valeria muito para o paciente?",
      "Que garantia você poderia oferecer que seus concorrentes não oferecem?",
      "Como seria sua oferta de entrada — algo gratuito ou de baixo risco para o primeiro contato?",
    ],
    tasks: [
      { id:"f5t1", label:"Criar oferta de entrada (Lead Magnet): avaliação gratuita com simulação digital", deliverable:"Script da consulta de avaliação + o que o paciente recebe ao final" },
      { id:"f5t2", label:"Montar o Value Stack por procedimento principal (implante, facetas, ortodontia)", deliverable:"Lista de 5-7 itens de valor agregado por tratamento" },
      { id:"f5t3", label:"Definir política de garantia e reversão de risco", deliverable:"Texto de garantia para usar em comunicação" },
      { id:"f5t4", label:"Criar tabela de ancoragem de preços (opção completa → intermediária → básica)", deliverable:"Menu de opções por tratamento" },
      { id:"f5t5", label:"Escrever o script de apresentação de proposta para a equipe", deliverable:"Roteiro de 5 minutos para apresentar orçamento ao paciente" },
    ],
    tools: ["Canva para material visual da proposta", "Claude para refinar o copy das ofertas"],
    duration: "1–2 semanas",
  },
  {
    id: "f6", tag: "FASE 6", label: "Execução Digital", color: "#5BA8E5", icon: "📱",
    how: "Agora que a base está sólida, ativar os canais. A ordem certa: Google Meu Negócio → Instagram → tráfego pago. Não pule para anúncios sem os outros dois otimizados.",
    questions: [
      "Quem vai gerenciar o Instagram? (você, secretária, ou agência?)",
      "Você tem fotos profissionais do consultório e da equipe?",
      "Tem casos de antes/depois com autorização assinada?",
      "Qual é o orçamento mensal para tráfego pago?",
    ],
    tasks: [
      { id:"f6t1", label:"Otimizar Google Meu Negócio: fotos, descrição, categoria, horário, posts semanais", deliverable:"GMB 100% preenchido e com primeiras avaliações solicitadas" },
      { id:"f6t2", label:"Criar calendário de conteúdo para 30 dias (1 Reel + 3 Stories/semana)", deliverable:"Planilha de conteúdo com tema, roteiro e data" },
      { id:"f6t3", label:"Produzir sessão de fotos e vídeos profissionais do consultório", deliverable:"50+ fotos + 5 vídeos curtos prontos para usar" },
      { id:"f6t4", label:"Configurar funil: tráfego pago → landing page → WhatsApp → agendamento", deliverable:"Funil funcionando com primeiro anúncio no ar" },
      { id:"f6t5", label:"Criar sequência de mensagens no WhatsApp (confirmação → lembrete → pós-consulta)", deliverable:"3 templates de mensagem aprovados" },
      { id:"f6t6", label:"Estruturar programa de indicação com benefício para quem indica", deliverable:"Regras do programa + material de comunicação para o paciente" },
    ],
    tools: ["Meta Ads Manager", "Google Ads", "Canva para conteúdo", "ManyChat ou WhatsApp Business API", "Linktree para bio do Instagram"],
    duration: "Contínuo — primeiros 30 dias de setup, depois manutenção semanal",
  },
  {
    id: "f7", tag: "FASE 7", label: "Crescimento & Escala", color: "#6EC9C4", icon: "🚀",
    how: "Depois de 90 dias com a estratégia rodando, revisar métricas e escalar o que funciona. Nunca escale o que não está convertendo — jogue mais dinheiro no que já prova resultado.",
    questions: [
      "Qual canal trouxe mais pacientes novos nos últimos 30 dias?",
      "Qual é seu CAC atual (custo por novo paciente)?",
      "Qual é o LTV médio por paciente (quanto ele gasta com você em 1 ano)?",
      "Quais 20% das ações de marketing geram 80% dos resultados?",
    ],
    tasks: [
      { id:"f7t1", label:"Criar dashboard de métricas mensais: CAC, LTV, NPS, taxa de retorno, ticket médio", deliverable:"Planilha de métricas para preencher todo mês" },
      { id:"f7t2", label:"Implementar sistema de coleta de avaliações Google (pedir no momento certo)", deliverable:"Processo documentado + link direto para avaliação" },
      { id:"f7t3", label:"Identificar 5 parceiros estratégicos (personal, nutricionista, coach de imagem)", deliverable:"Lista de parceiros + proposta de parceria enviada" },
      { id:"f7t4", label:"Fazer revisão trimestral de estratégia: o que parar, manter, escalar", deliverable:"Relatório trimestral de marketing" },
      { id:"f7t5", label:"Avaliar expansão: novo procedimento, horário VIP, segundo consultório", deliverable:"Plano de expansão para os próximos 12 meses" },
    ],
    tools: ["Google Looker Studio para dashboard", "NPS via Google Forms", "Reunião mensal de revisão de métricas"],
    duration: "Revisão mensal — estratégia contínua",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────
const gold="#C9A96E", bg="#0D0D0F", card="#111113", border="#1E1E21", txt="#F0EDE6", muted="#888", sm="system-ui,sans-serif";

const totalTasks = PHASES.reduce((acc,p)=>acc+p.tasks.length,0);

// ─── Components ───────────────────────────────────────────────────
const Badge = ({label,color})=>(
  <span style={{padding:"2px 8px",borderRadius:10,background:`${color}22`,color,fontSize:10,fontFamily:sm,fontWeight:700,letterSpacing:"0.05em"}}>
    {label}
  </span>
);

function ProgressBar({done,total,color}){
  const pct = total ? Math.round(done/total*100) : 0;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:11,color:muted,fontFamily:sm}}>{done}/{total} tarefas</span>
        <span style={{fontSize:11,color,fontFamily:sm,fontWeight:700}}>{pct}%</span>
      </div>
      <div style={{height:4,background:"#ffffff08",borderRadius:2}}>
        <div style={{height:4,background:color,borderRadius:2,width:`${pct}%`,transition:"width 0.5s"}}/>
      </div>
    </div>
  );
}

function PhaseCard({phase,done,total,active,onClick}){
  const pct = total ? Math.round(done/total*100) : 0;
  const status = pct===100?"✓ Concluída":pct>0?"Em andamento":"Não iniciada";
  return (
    <button onClick={onClick} style={{
      width:"100%",background:active?"#16161A":card,
      border:`1px solid ${active?phase.color:border}`,
      borderLeft:`4px solid ${pct===100?"#7EC8A4":pct>0?phase.color:border}`,
      borderRadius:8,padding:"16px 18px",textAlign:"left",cursor:"pointer",transition:"all 0.2s",marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18}}>{phase.icon}</span>
          <div>
            <div style={{fontSize:10,color:phase.color,fontFamily:sm,fontWeight:700,letterSpacing:"0.1em"}}>{phase.tag}</div>
            <div style={{fontSize:14,color:txt,fontFamily:sm,fontWeight:600}}>{phase.label}</div>
          </div>
        </div>
        <span style={{fontSize:10,color:pct===100?"#7EC8A4":pct>0?phase.color:muted,fontFamily:sm}}>{status}</span>
      </div>
      <ProgressBar done={done} total={total} color={phase.color}/>
    </button>
  );
}

function PhaseDetail({phase,checked,onToggle}){
  const [tab,setTab]=useState("tasks");
  const done = phase.tasks.filter(t=>checked[t.id]).length;

  return (
    <div style={{flex:1,padding:"36px 40px",overflowY:"auto"}}>
      {/* Header */}
      <div style={{marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <span style={{fontSize:32}}>{phase.icon}</span>
          <div>
            <div style={{fontSize:11,letterSpacing:"0.25em",color:phase.color,fontFamily:sm,fontWeight:700}}>{phase.tag}</div>
            <h2 style={{margin:"2px 0 0",fontSize:26,fontFamily:"Georgia,serif",fontWeight:400,color:txt}}>{phase.label}</h2>
          </div>
          <div style={{marginLeft:"auto"}}>
            <Badge label={`⏱ ${phase.duration}`} color={phase.color}/>
          </div>
        </div>
        <ProgressBar done={done} total={phase.tasks.length} color={phase.color}/>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:0,marginBottom:24,borderBottom:`1px solid ${border}`}}>
        {["tasks","questions","tools"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            padding:"10px 20px",background:"none",border:"none",cursor:"pointer",
            color:tab===t?txt:muted,fontFamily:sm,fontSize:13,fontWeight:tab===t?700:400,
            borderBottom:tab===t?`2px solid ${phase.color}`:"2px solid transparent",
            marginBottom:-1,transition:"all 0.2s"}}>
            {t==="tasks"?"✅ Tarefas & Entregáveis":t==="questions"?"❓ Perguntas para Responder":"🛠 Ferramentas"}
          </button>
        ))}
      </div>

      {/* How to */}
      <div style={{padding:16,background:"#111113",borderLeft:`3px solid ${phase.color}`,borderRadius:6,marginBottom:20}}>
        <div style={{fontSize:10,color:phase.color,fontFamily:sm,fontWeight:700,letterSpacing:"0.1em",marginBottom:6}}>COMO EXECUTAR ESTA FASE</div>
        <p style={{margin:0,fontSize:13,color:"#CCC",fontFamily:sm,lineHeight:1.8}}>{phase.how}</p>
      </div>

      {/* Tasks */}
      {tab==="tasks"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {phase.tasks.map((task,i)=>{
            const isDone = !!checked[task.id];
            return (
              <div key={task.id} onClick={()=>onToggle(task.id)}
                style={{background:isDone?"#0F1A140A":card,border:`1px solid ${isDone?"#7EC8A455":border}`,
                  borderRadius:8,padding:"16px 18px",cursor:"pointer",display:"flex",gap:14,
                  opacity:isDone?0.6:1,transition:"all 0.2s"}}>
                <div style={{width:22,height:22,borderRadius:6,
                  border:`2px solid ${isDone?"#7EC8A4":border}`,
                  background:isDone?"#7EC8A433":"transparent",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color:"#7EC8A4",fontSize:13,fontWeight:700,flexShrink:0,marginTop:1}}>
                  {isDone&&"✓"}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,color:txt,fontFamily:sm,fontWeight:600,
                    textDecoration:isDone?"line-through":"none",marginBottom:6}}>
                    {i+1}. {task.label}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:10,color:muted,fontFamily:sm}}>📄 Entregável:</span>
                    <span style={{fontSize:12,color:phase.color,fontFamily:sm,fontWeight:600}}>{task.deliverable}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Questions */}
      {tab==="questions"&&(
        <div>
          <p style={{fontSize:13,color:muted,fontFamily:sm,marginBottom:16,lineHeight:1.7}}>
            Responda estas perguntas antes de começar a executar. Anote em um documento — as respostas viram os briefings das próximas entregas.
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {phase.questions.map((q,i)=>(
              <div key={i} style={{padding:"14px 18px",background:card,border:`1px solid ${border}`,
                borderLeft:`3px solid ${phase.color}44`,borderRadius:8}}>
                <span style={{fontSize:12,color:phase.color,fontFamily:sm,fontWeight:700,marginRight:8}}>{i+1}.</span>
                <span style={{fontSize:13,color:txt,fontFamily:sm,lineHeight:1.7}}>{q}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,padding:12,background:"#111113",borderRadius:6}}>
            <p style={{margin:0,fontSize:12,color:muted,fontFamily:sm}}>
              💡 Dica: Você pode copiar essas perguntas e me mandar as respostas — eu processo e gero os entregáveis da fase diretamente para você.
            </p>
          </div>
        </div>
      )}

      {/* Tools */}
      {tab==="tools"&&(
        <div>
          <p style={{fontSize:13,color:muted,fontFamily:sm,marginBottom:16}}>Ferramentas recomendadas para esta fase:</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {phase.tools.map((t,i)=>(
              <div key={i} style={{padding:"12px 16px",background:card,border:`1px solid ${border}`,borderRadius:8,
                display:"flex",alignItems:"center",gap:10}}>
                <span style={{color:phase.color,fontSize:16}}>→</span>
                <span style={{fontSize:13,color:txt,fontFamily:sm}}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:20,padding:16,background:"#111113",border:`1px solid ${border}`,borderRadius:8}}>
            <div style={{fontSize:11,color:gold,fontFamily:sm,fontWeight:700,marginBottom:8}}>🤖 O QUE A CLAUDE PODE GERAR POR VOCÊ</div>
            <div style={{fontSize:13,color:"#CCC",fontFamily:sm,lineHeight:1.8}}>
              Em qualquer fase, você pode me enviar as respostas das perguntas e eu gero:<br/>
              • Manifesto de marca • Golden Circle • PUV • Logline • SB7 preenchido<br/>
              • Copy para bio do Instagram • Script de proposta • Templates de post<br/>
              • Planilha de métricas • Calendário de conteúdo 30 dias
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Backlog({phases,checked,onToggle}){
  const [filter,setFilter]=useState("all");
  const all = phases.flatMap(p=>p.tasks.map(t=>({...t,phase:p})));
  const filtered = all.filter(t=>filter==="all"?true:filter==="done"?checked[t.id]:!checked[t.id]);
  const done = all.filter(t=>checked[t.id]).length;

  return (
    <div style={{flex:1,padding:"36px 40px",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <h2 style={{margin:0,fontFamily:"Georgia,serif",fontSize:26,fontWeight:400,color:txt}}>Backlog Completo</h2>
        <div style={{fontSize:13,color:muted,fontFamily:sm}}>{done}/{all.length} tarefas concluídas</div>
      </div>

      <div style={{marginBottom:24}}>
        <div style={{height:6,background:"#ffffff08",borderRadius:3}}>
          <div style={{height:6,background:gold,borderRadius:3,width:`${Math.round(done/all.length*100)}%`,transition:"width 0.5s"}}/>
        </div>
        <div style={{fontSize:12,color:gold,fontFamily:sm,marginTop:6,textAlign:"right"}}>
          {Math.round(done/all.length*100)}% da estratégia concluída
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {["all","pending","done"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"6px 14px",borderRadius:6,cursor:"pointer",fontFamily:sm,fontSize:12,fontWeight:600,
            background:filter===f?gold:"transparent",color:filter===f?bg:muted,
            border:`1px solid ${filter===f?gold:border}`}}>
            {f==="all"?"Todas":f==="pending"?"Pendentes":"Concluídas"}
          </button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map((task,i)=>{
          const isDone=!!checked[task.id];
          return (
            <div key={task.id} onClick={()=>onToggle(task.id)}
              style={{background:isDone?"transparent":card,border:`1px solid ${isDone?"#1A1A1D":border}`,
                borderRadius:8,padding:"12px 16px",cursor:"pointer",
                display:"flex",alignItems:"center",gap:12,opacity:isDone?0.5:1,transition:"all 0.2s"}}
              onMouseEnter={e=>!isDone&&(e.currentTarget.style.borderColor=task.phase.color)}
              onMouseLeave={e=>e.currentTarget.style.borderColor=isDone?"#1A1A1D":border}>
              <div style={{width:18,height:18,borderRadius:4,
                border:`2px solid ${isDone?"#7EC8A4":border}`,
                background:isDone?"#7EC8A433":"transparent",
                display:"flex",alignItems:"center",justifyContent:"center",
                color:"#7EC8A4",fontSize:11,flexShrink:0}}>
                {isDone&&"✓"}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,color:txt,fontFamily:sm,fontWeight:600,
                  textDecoration:isDone?"line-through":"none"}}>{task.label}</div>
                <div style={{fontSize:11,color:task.phase.color,fontFamily:sm,marginTop:2}}>
                  {task.phase.tag} · {task.phase.label}
                </div>
              </div>
              <div style={{fontSize:11,color:muted,fontFamily:sm,maxWidth:200,textAlign:"right"}}>{task.deliverable}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ─── APP ──────────────────────────────────────────────────────────
const globalStyle = document.createElement('style');
globalStyle.innerHTML = '* { margin: 0; padding: 0; box-sizing: border-box; } body { background: #0D0D0F; }';
document.head.appendChild(globalStyle);

export default function App(){
  const [active,setActive]=useState("f0");
  const [checked,setChecked]=useState({});
  const [loading,setLoading]=useState(true);
  const [view,setView]=useState("phase"); // "phase" | "backlog"

  useEffect(()=>{
    (async()=>{
      const c=await db.get("strategy:checked");
      if(c)setChecked(c);
      setLoading(false);
    })();
  },[]);

  const toggle=async(id)=>{
    const next={...checked,[id]:!checked[id]};
    setChecked(next);
    await db.set("strategy:checked",next);
  };

  const totalDone=Object.values(checked).filter(Boolean).length;
  const activePhase=PHASES.find(p=>p.id===active);

  if(loading) return <div style={{minHeight:"100vh",background:bg,display:"flex",alignItems:"center",
    justifyContent:"center",color:gold,fontFamily:"Georgia,serif"}}>Carregando…</div>;

  return (
    <div style={{minHeight:"100vh",background:bg,color:txt,display:"flex",flexDirection:"column"}}>
      {/* Top bar */}
      <div style={{borderBottom:`1px solid ${border}`,padding:"16px 28px",
        display:"flex",alignItems:"center",gap:16,background:"#0D0D0F"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:10,letterSpacing:"0.3em",color:muted,fontFamily:sm}}>PLANO DE MARCA & ESTRATÉGIA</div>
          <div style={{fontSize:18,fontFamily:"Georgia,serif",color:gold}}>Clínica Pedroso</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{fontSize:13,color:muted,fontFamily:sm}}>{totalDone}/{totalTasks} tarefas</div>
          <div style={{width:120,height:4,background:"#ffffff08",borderRadius:2}}>
            <div style={{height:4,background:gold,borderRadius:2,width:`${Math.round(totalDone/totalTasks*100)}%`}}/>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>setView("phase")} style={{padding:"6px 14px",borderRadius:6,cursor:"pointer",
              fontFamily:sm,fontSize:12,background:view==="phase"?gold:"transparent",
              color:view==="phase"?bg:muted,border:`1px solid ${view==="phase"?gold:border}`}}>Por Fase</button>
            <button onClick={()=>setView("backlog")} style={{padding:"6px 14px",borderRadius:6,cursor:"pointer",
              fontFamily:sm,fontSize:12,background:view==="backlog"?gold:"transparent",
              color:view==="backlog"?bg:muted,border:`1px solid ${view==="backlog"?gold:border}`}}>Backlog</button>
          </div>
        </div>
      </div>

      <div style={{display:"flex",flex:1,minHeight:0}}>
        {/* Sidebar */}
        {view==="phase"&&(
          <div style={{width:280,minWidth:280,borderRight:`1px solid ${border}`,overflowY:"auto",padding:"20px 16px"}}>
            {PHASES.map(phase=>{
              const done=phase.tasks.filter(t=>checked[t.id]).length;
              return <PhaseCard key={phase.id} phase={phase} done={done} total={phase.tasks.length}
                active={active===phase.id} onClick={()=>setActive(phase.id)}/>;
            })}
          </div>
        )}

        {view==="phase"&&activePhase
          ? <PhaseDetail phase={activePhase} checked={checked} onToggle={toggle}/>
          : view==="backlog" && <Backlog phases={PHASES} checked={checked} onToggle={toggle}/>
        }
      </div>

      {/* Footer */}
      <div style={{borderTop:`1px solid #161618`,padding:"12px 28px",
        display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#0A0A0C"}}>
        <span style={{fontSize:10,color:"#2D2D2D",fontFamily:sm,letterSpacing:"0.18em"}}>PROJETO DESENVOLVIDO POR</span>
        <span style={{fontSize:10,color:"#2D2D2D",fontFamily:sm}}>·</span>
        <span style={{fontSize:11,fontFamily:sm,color:"#3A3A3A",fontWeight:600,letterSpacing:"0.2em"}}>PAJARO MARKETING</span>
      </div>
    </div>
  );
}
