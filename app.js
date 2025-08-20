// ====== DADOS ======
let series = JSON.parse(localStorage.getItem('series')||'[]');
let analistas = JSON.parse(localStorage.getItem('analistas')||'[]');
let logs = JSON.parse(localStorage.getItem('logs')||'[]');

// ====== ABAS ======
function showTab(tab){
    document.querySelectorAll('.tab').forEach(t=>t.style.display='none');
    document.getElementById(tab).style.display='block';
    atualizarChecklist();
    atualizarAnalistas();
    atualizarLogs();
    atualizarVisaoGeral();
}

// ====== VISÃO GERAL ======
function atualizarVisaoGeral(){
    let teclado=0, mouse=0, leitor=0, zebra=0;
    series.forEach(s=>{
        if(!s.teclado) teclado++;
        if(!s.mouse) mouse++;
        if(!s.leitor) leitor++;
        if(!s.zebra) zebra++;
    });
    document.getElementById('faltantesTeclado').textContent=teclado;
    document.getElementById('faltantesMouse').textContent=mouse;
    document.getElementById('faltantesLeitor').textContent=leitor;
    document.getElementById('faltantesZebra').textContent=zebra;
}

// ====== CHECKLIST SÉRIES ======
document.getElementById('serieForm').onsubmit=e=>{
    e.preventDefault();
    const index=document.getElementById('serieIndex').value;
    const s={
        nome: document.getElementById('serieNome').value,
        hostname: document.getElementById('serieHostname').value,
        teclado: document.getElementById('serieTeclado').checked,
        mouse: document.getElementById('serieMouse').checked,
        leitor: document.getElementById('serieLeitor').checked,
        zebra: document.getElementById('serieZebra').checked,
        lacre: document.getElementById('serieLacre').value,
        analista: document.getElementById('serieAnalista').value,
        dataHora: new Date().toLocaleString()
    };
    if(index===''){
        series.push(s);
        adicionarLog(`Série ${s.nome} adicionada`);
    } else {
        series[index]=s;
        adicionarLog(`Série ${s.nome} editada`);
    }
    salvarSeries();
    atualizarChecklist();
    atualizarVisaoGeral();
    cancelarSerieForm();
};
function cancelarSerieForm(){
    document.getElementById('serieForm').reset();
    document.getElementById('serieIndex').value='';
}
function atualizarChecklist(){
    aplicarFiltros();
    const select=document.getElementById('serieAnalista');
    select.innerHTML='<option value="">Selecione</option>';
    analistas.forEach(a=>select.innerHTML+=`<option value="${a.nome}">${a.nome}</option>`);
}
function editarSerie(i){
    const s=series[i];
    document.getElementById('serieIndex').value=i;
    document.getElementById('serieNome').value=s.nome;
    document.getElementById('serieHostname').value=s.hostname;
    document.getElementById('serieTeclado').checked=s.teclado;
    document.getElementById('serieMouse').checked=s.mouse;
    document.getElementById('serieLeitor').checked=s.leitor;
    document.getElementById('serieZebra').checked=s.zebra;
    document.getElementById('serieLacre').value=s.lacre;
    document.getElementById('serieAnalista').value=s.analista||'';
}
function excluirSerie(i){ 
    adicionarLog(`Série ${series[i].nome} excluída`); 
    series.splice(i,1); 
    salvarSeries(); 
    atualizarChecklist(); 
}
function salvarSeries(){ localStorage.setItem('series',JSON.stringify(series)); }

// ====== FILTROS ======
function aplicarFiltros(){
    const nome=document.getElementById('filtroSerieNome').value.toLowerCase();
    const analista=document.getElementById('filtroAnalista').value;
    const teclado=document.getElementById('filtroTeclado').checked;
    const mouse=document.getElementById('filtroMouse').checked;
    const leitor=document.getElementById('filtroLeitor').checked;
    const zebra=document.getElementById('filtroZebra').checked;
    const tbody=document.getElementById('checklistContent');
    tbody.innerHTML='';
    series.forEach((s,i)=>{
        if(nome && !s.nome.toLowerCase().includes(nome)) return;
        if(analista && s.analista!==analista) return;
        if(teclado && !s.teclado) return;
        if(mouse && !s.mouse) return;
        if(leitor && !s.leitor) return;
        if(zebra && !s.zebra) return;
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${s.nome}</td><td>${s.hostname}</td>
        <td>${s.teclado?'✅':'❌'}</td><td>${s.mouse?'✅':'❌'}</td>
        <td>${s.leitor?'✅':'❌'}</td><td>${s.zebra?'✅':'❌'}</td>
        <td>${s.lacre||''}</td><td>${s.analista||''}</td><td>${s.dataHora||''}</td>
        <td>
        <button class="btn-acao" onclick="editarSerie(${i})">✏️</button>
        <button class="btn-acao" onclick="excluirSerie(${i})">🗑️</button>
        </td>`;
        tbody.appendChild(tr);
    });
}

// ====== ANALISTAS ======
function atualizarAnalistas(){
    const tbody=document.getElementById('analistasContent');
    tbody.innerHTML='';
    analistas.forEach((a,i)=>{
        const statusClass=a.ativo?'status-ativo':'status-inativo';
        const icon=a.ativo?'🔓':'🔒';
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${a.nome}</td><td>${a.email}</td><td class="${statusClass}">${a.ativo?'Ativo':'Inativo'}</td>
        <td>
        <button class="btn-acao" onclick="editarAnalista(${i})">✏️</button>
        <button class="btn-acao" onclick="inativarAnalista(${i})">${icon}</button>
        <button class="btn-acao" onclick="excluirAnalista(${i})">🗑️</button>
        </td>`;
        tbody.appendChild(tr);
    });
    const select=document.getElementById('filtroAnalista');
    select.innerHTML='<option value="">Todos</option>';
    analistas.forEach(a=>select.innerHTML+=`<option value="${a.nome}">${a.nome}</option>`);
}
function salvarAnalistaForm(e){
    e.preventDefault();
    const index=document.getElementById('analistaIndex').value;
    const a={
        nome: document.getElementById('analistaNome').value,
        email: document.getElementById('analistaEmail').value,
        ativo:true
    };
    if(index===''){ analistas.push(a); adicionarLog(`Analista ${a.nome} adicionado`); }
    else{
        const old=analistas[index];
        analistas[index]=a;
        a.ativo=old.ativo;
        adicionarLog(`Analista ${a.nome} editado`);
    }
    salvarAnalistas(); atualizarAnalistas(); cancelarAnalistaForm();
}
function cancelarAnalistaForm(){ document.getElementById('analistaForm').reset(); document.getElementById('analistaIndex').value=''; }
function editarAnalista(i){
    const a=analistas[i];
    document.getElementById('analistaIndex').value=i;
    document.getElementById('analistaNome').value=a.nome;
    document.getElementById('analistaEmail').value=a.email;
}
function inativarAnalista(i){
    analistas[i].ativo=!analistas[i].ativo;
    adicionarLog(`Analista ${analistas[i].nome} ${analistas[i].ativo?'reativado':'inativado'}`);
    salvarAnalistas(); atualizarAnalistas();
}
function excluirAnalista(i){ adicionarLog(`Analista ${analistas[i].nome} excluído`); analistas.splice(i,1); salvarAnalistas(); atualizarAnalistas(); }
function salvarAnalistas(){ localStorage.setItem('analistas',JSON.stringify(analistas)); }

// ====== LOGS ======
function adicionarLog(msg){
    const log={dataHora:new Date().toLocaleString(),acao:msg};
    logs.push(log);
    localStorage.setItem('logs',JSON.stringify(logs));
    atualizarLogs();
}
function atualizarLogs(){
    const tbody=document.getElementById('logsContent');
    tbody.innerHTML='';
    logs.forEach(l=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${l.dataHora}</td><td>${l.acao}</td>`;
        tbody.appendChild(tr);
    });
}
function limparLogs(){ logs=[]; localStorage.setItem('logs',JSON.stringify(logs)); atualizarLogs(); }

// ====== EXPORT ======
function downloadFile(filename, content){
    const blob=new Blob(content instanceof Array?content:[content],{type:'text/plain'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=filename;
    a.click();
}
function exportarLogsTXT(){ downloadFile('logs.txt', logs.map(l=>`${l.dataHora} - ${l.acao}`).join('\n')); }
function exportarLogsCSV(){
    if(logs.length===0){ alert('Sem logs'); return; }
    const csv=['Data/Hora,Ação'];
    logs.forEach(l=>{
        const acao=l.acao.replace(/[,]/g,'');
        csv.push(`${l.dataHora},${acao}`);
    });
    downloadFile('logs.csv',csv.join('\n'));
}
function exportarSeriesCSV(){
    if(series.length===0){ alert('Não há séries'); return; }
    const headers=['Nome','Hostname','Teclado','Mouse','Leitor','Zebra','Lacre','Analista','DataHora'];
    const rows = series.map(s=>[
        s.nome.normalize('NFD').replace(/[\u0300-\u036f]/g,""),
        s.hostname.normalize('NFD').replace(/[\u0300-\u036f]/g,""),
        s.teclado?'✅':'❌', s.mouse?'✅':'❌', s.leitor?'✅':'❌', s.zebra?'✅':'❌',
        s.lacre||'', s.analista||'', s.dataHora||''
    ].join(','));
    downloadFile('series.csv',[headers.join(','), ...rows].join('\n'));
}

// ====== INICIALIZAÇÃO ======
showTab('visaoGeral');
