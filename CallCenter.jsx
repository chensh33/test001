
const CallCenter = ({ data, onCreateCase }) => {
  const [activeCalls, setActiveCalls] = React.useState(data.calls);
  const [selectedCall, setSelectedCall] = React.useState(data.calls[0]);
  const [logModal, setLogModal] = React.useState(false);
  const [newCallModal, setNewCallModal] = React.useState(false);
  const [concern, setConcern] = React.useState('');
  const [callReason, setCallReason] = React.useState('Benefits Question');
  const [searchMember, setSearchMember] = React.useState('');
  const [selectedMember, setSelectedMember] = React.useState(null);
  const [timer, setTimer] = React.useState(0);
  const [logs, setLogs] = React.useState([
    { time: '10:05 AM', agent: 'Lisa Chen', member: 'Yuki Tanaka', reason: 'Benefits Question', duration: '4:32', outcome: 'Resolved', caseCreated: false },
    { time: '09:48 AM', agent: 'Mike Patel', member: 'James Thornton', reason: 'Auth Status', duration: '7:15', outcome: 'Case Created', caseCreated: true },
    { time: '09:30 AM', agent: 'Carlos Mendez', member: 'Maria Torres', reason: 'Billing Inquiry', duration: '3:50', outcome: 'Transferred', caseCreated: false },
  ]);

  React.useEffect(() => {
    const t = setInterval(() => setTimer(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const handleLogConcern = () => {
    if (!concern.trim()) return;
    setLogs(l => [{ time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}), agent: 'You', member: selectedCall?.memberName || '—', reason: selectedCall?.reason || '—', duration: fmt(timer), outcome: 'Logged', caseCreated: false }, ...l]);
    setConcern('');
    setLogModal(false);
  };

  const reasonColors = {
    'Authorization Status': FluentColors.warning,
    'Billing Inquiry': FluentColors.error,
    'Benefits Question': FluentColors.primary,
    'Care Management': FluentColors.teal,
    'Grievance': FluentColors.purple,
    'General Inquiry': FluentColors.success,
  };

  const memberMatch = data.members.filter(m => m.name.toLowerCase().includes(searchMember.toLowerCase()) || m.memberId.toLowerCase().includes(searchMember.toLowerCase())).slice(0, 5);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CommandBar title="Call Center" subtitle="Live operations"
        actions={[
          { label: '📞 Incoming Call', primary: true, onClick: () => setNewCallModal(true) },
          { label: '📋 Log Concern', onClick: () => setLogModal(true) },
        ]} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Queue + Agent Status */}
        <div style={{ width: 300, borderRight: `1px solid ${FluentColors.border}`, display: 'flex', flexDirection: 'column', background: FluentColors.surface }}>
          {/* Agent Status */}
          <div style={{ padding: '10px 14px', borderBottom: `1px solid ${FluentColors.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: FluentColors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Agent Status</div>
            {data.agents.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: `1px solid ${FluentColors.bg}` }}>
                <div style={{ position: 'relative' }}>
                  <Avatar initials={a.name.split(' ').map(x=>x[0]).join('')} color={FluentColors.primary} size={28} />
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 8, height: 8, borderRadius: '50%', border: '1.5px solid #fff',
                    background: a.status === 'On Call' ? FluentColors.success : a.status === 'Available' ? '#107c10' : a.status === 'Wrap-Up' ? FluentColors.warning : '#a19f9d',
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{a.name}</div>
                  <div style={{ fontSize: 10, color: FluentColors.textMuted }}>{a.id}</div>
                </div>
                <Badge label={a.status} />
              </div>
            ))}
          </div>

          {/* Active Queue */}
          <div style={{ padding: '10px 14px 6px', borderBottom: `1px solid ${FluentColors.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: FluentColors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Active Queue ({activeCalls.length})
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {activeCalls.map(call => (
              <div key={call.id} onClick={() => setSelectedCall(call)}
                style={{
                  padding: '10px 14px', borderBottom: `1px solid ${FluentColors.bg}`, cursor: 'pointer',
                  background: selectedCall?.id === call.id ? FluentColors.primaryLight : 'transparent',
                  borderLeft: selectedCall?.id === call.id ? `3px solid ${FluentColors.primary}` : '3px solid transparent',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{call.memberName}</span>
                  <Badge label={call.status} />
                </div>
                <div style={{ fontSize: 11, color: FluentColors.textSecondary, marginBottom: 4 }}>{call.reason}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: FluentColors.textMuted }}>
                  <span>Agent: {call.agentName}</span>
                  <span>⏱ {call.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Active Call Detail */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selectedCall ? (
            <>
              {/* Call banner */}
              <div style={{ background: '#0b5a2e', color: '#fff', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6bd06b', animation: 'pulse 1.5s infinite' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{selectedCall.memberName}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{selectedCall.reason} · Agent: {selectedCall.agentName} · Started {selectedCall.startTime}</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace' }}>{fmt(timer + 180)}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>Hold</button>
                  <button style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>Transfer</button>
                  <button style={{ padding: '5px 12px', background: '#c50f1f', color: '#fff', border: 'none', borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>End Call</button>
                </div>
              </div>

              <div style={{ flex: 1, overflow: 'auto', padding: 20, background: FluentColors.bg }}>
                {/* Member quick info */}
                {(() => {
                  const m = data.members.find(x => x.id === selectedCall.memberId);
                  if (!m) return null;
                  return (
                    <div style={{ background: FluentColors.surface, padding: 16, border: `1px solid ${FluentColors.border}`, borderRadius: 4, marginBottom: 16 }}>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
                        <Avatar initials={m.avatar} color={m.color} size={40} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>{m.name}</div>
                          <div style={{ fontSize: 12, color: FluentColors.textSecondary }}>{m.memberId} · {m.plan}</div>
                        </div>
                        <Badge label={m.status} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, padding: '12px 0', borderTop: `1px solid ${FluentColors.border}` }}>
                        <div><div style={{ fontSize: 10, color: FluentColors.textMuted, marginBottom: 2 }}>DOB</div><div style={{ fontSize: 12, fontWeight: 600 }}>{m.dob}</div></div>
                        <div><div style={{ fontSize: 10, color: FluentColors.textMuted, marginBottom: 2 }}>Phone</div><div style={{ fontSize: 12, fontWeight: 600 }}>{m.phone}</div></div>
                        <div><div style={{ fontSize: 10, color: FluentColors.textMuted, marginBottom: 2 }}>PCP</div><div style={{ fontSize: 12, fontWeight: 600 }}>{m.pcp}</div></div>
                        <div><div style={{ fontSize: 10, color: FluentColors.textMuted, marginBottom: 2 }}>Open Cases</div><div style={{ fontSize: 12, fontWeight: 600, color: m.openCases > 0 ? FluentColors.error : FluentColors.text }}>{m.openCases}</div></div>
                      </div>
                    </div>
                  );
                })()}

                {/* Log concern */}
                <div style={{ background: FluentColors.surface, padding: 16, border: `1px solid ${FluentColors.border}`, borderRadius: 4, marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Log Member Concern</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
                    <FormField label="Concern Type" value={callReason} onChange={setCallReason}
                      options={['Authorization Status','Billing Inquiry','Benefits Question','Care Management','Grievance','General Inquiry','Complaint','Emergency']} />
                    <FormField label="Priority" value="Medium" options={['Low','Medium','High','Urgent']} />
                  </div>
                  <FormField label="Notes" value={concern} onChange={setConcern} type="textarea" />
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button onClick={handleLogConcern} style={{ padding: '6px 16px', background: FluentColors.primary, color: '#fff', border: 'none', borderRadius: 2, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>Log Concern</button>
                    <button onClick={() => onCreateCase(data.members.find(x => x.id === selectedCall.memberId))} style={{ padding: '6px 16px', background: 'none', border: `1px solid ${FluentColors.borderDark}`, borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>+ Create Case</button>
                  </div>
                </div>

                {/* Recent cases for member */}
                {(() => {
                  const cases = data.cases.filter(c => c.memberId === selectedCall.memberId);
                  return cases.length > 0 && (
                    <div style={{ background: FluentColors.surface, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
                      <div style={{ padding: '10px 16px', borderBottom: `1px solid ${FluentColors.border}`, fontWeight: 600, fontSize: 13 }}>Member Cases</div>
                      {cases.slice(0,3).map(c => (
                        <div key={c.id} style={{ padding: '10px 16px', borderBottom: `1px solid ${FluentColors.bg}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600 }}>{c.id} — {c.type}</div>
                            <div style={{ fontSize: 11, color: FluentColors.textSecondary }}>{c.description.slice(0, 60)}...</div>
                          </div>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <Badge label={c.priority} />
                            <Badge label={c.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </>
          ) : <EmptyState icon="📞" title="No call selected" subtitle="Select an active call from the queue" />}
        </div>

        {/* Right: Call Log */}
        <div style={{ width: 280, borderLeft: `1px solid ${FluentColors.border}`, background: FluentColors.surface, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '10px 14px', borderBottom: `1px solid ${FluentColors.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: FluentColors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Today's Call Log</div>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {logs.map((l, i) => (
              <div key={i} style={{ padding: '10px 14px', borderBottom: `1px solid ${FluentColors.bg}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{l.member}</span>
                  <span style={{ fontSize: 10, color: FluentColors.textMuted }}>{l.time}</span>
                </div>
                <div style={{ fontSize: 11, color: FluentColors.textSecondary, marginBottom: 4 }}>{l.reason} · {l.duration}</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <span style={{ fontSize: 10, padding: '2px 6px', background: FluentColors.bg, borderRadius: 2, color: FluentColors.textSecondary }}>{l.outcome}</span>
                  {l.caseCreated && <span style={{ fontSize: 10, padding: '2px 6px', background: FluentColors.primaryLight, borderRadius: 2, color: FluentColors.primary }}>Case Created</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '8px 14px', borderTop: `1px solid ${FluentColors.border}`, fontSize: 11, color: FluentColors.textMuted, textAlign: 'center' }}>
            {logs.length} calls today
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }`}</style>
    </div>
  );
};

window.CallCenter = CallCenter;
