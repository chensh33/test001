
const Dashboard = ({ data, onNavigate }) => {
  const openCases = data.cases.filter(c => c.status !== 'Closed').length;
  const activeCalls = data.calls.filter(c => c.status === 'Active').length;
  const highPriority = data.cases.filter(c => c.priority === 'High' && c.status !== 'Closed').length;
  const pendingAuth = data.cases.filter(c => c.type === 'Authorization' && c.status === 'Open').length;

  const metrics = [
    { label: 'Active Members', value: data.members.filter(m => m.status === 'Active').length, sub: '+3 this week', color: FluentColors.primary, icon: '👥' },
    { label: 'Open Cases', value: openCases, sub: `${highPriority} high priority`, color: FluentColors.error, icon: '📋' },
    { label: 'Active Calls', value: activeCalls, sub: 'in queue now', color: FluentColors.success, icon: '📞' },
    { label: 'Pending Auths', value: pendingAuth, sub: 'awaiting decision', color: FluentColors.warning, icon: '⏳' },
  ];

  const recentCases = data.cases.filter(c => c.status !== 'Closed').slice(0, 4);
  const dueToday = data.cases.filter(c => c.dueDate === '2025-04-21' || c.dueDate === '2025-04-22');
  const activeWorkflows = data.workflows.filter(w => w.status !== 'Completed');

  return (
    <div style={{ flex: 1, overflow: 'auto', background: FluentColors.bg }}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${FluentColors.border}`, background: FluentColors.surface }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: FluentColors.text }}>Dashboard</div>
        <div style={{ fontSize: 12, color: FluentColors.textSecondary, marginTop: 2 }}>Monday, April 21, 2025 — Healthcare CRM Operations</div>
      </div>

      <div style={{ padding: 24 }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {metrics.map((m, i) => (
            <div key={i} style={{
              background: FluentColors.surface, padding: '16px 18px',
              border: `1px solid ${FluentColors.border}`, borderRadius: 4,
              borderTop: `3px solid ${m.color}`, cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: FluentColors.text, marginTop: 2 }}>{m.label}</div>
                  <div style={{ fontSize: 11, color: FluentColors.textMuted, marginTop: 2 }}>{m.sub}</div>
                </div>
                <span style={{ fontSize: 24 }}>{m.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Open Cases */}
          <div style={{ background: FluentColors.surface, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${FluentColors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>Open Cases</span>
              <button onClick={() => onNavigate('cases')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: FluentColors.primary, fontSize: 12 }}>View all →</button>
            </div>
            <div>
              {recentCases.map(c => (
                <div key={c.id} style={{ padding: '10px 16px', borderBottom: `1px solid ${FluentColors.bg}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: FluentColors.text, marginBottom: 2 }}>{c.id}</div>
                    <div style={{ fontSize: 11, color: FluentColors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.memberName} · {c.type}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <Badge label={c.priority} />
                    <Badge label={c.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Workflows */}
          <div style={{ background: FluentColors.surface, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${FluentColors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>Active Workflows</span>
              <button onClick={() => onNavigate('workflows')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: FluentColors.primary, fontSize: 12 }}>View all →</button>
            </div>
            <div>
              {activeWorkflows.map(w => {
                const pct = Math.round((w.currentStep / (w.steps.length - 1)) * 100);
                return (
                  <div key={w.id} style={{ padding: '10px 16px', borderBottom: `1px solid ${FluentColors.bg}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: FluentColors.text }}>{w.name}</div>
                      <Badge label={w.status} />
                    </div>
                    <div style={{ fontSize: 11, color: FluentColors.textSecondary, marginBottom: 6 }}>{w.member || w.provider} · {w.department}</div>
                    <div style={{ height: 4, background: FluentColors.bgDark, borderRadius: 2 }}>
                      <div style={{ height: 4, background: FluentColors.primary, borderRadius: 2, width: `${pct}%`, transition: 'width 0.3s' }} />
                    </div>
                    <div style={{ fontSize: 10, color: FluentColors.textMuted, marginTop: 2 }}>Step {w.currentStep + 1} of {w.steps.length}: {w.steps[w.currentStep]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Call Center Summary */}
          <div style={{ background: FluentColors.surface, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${FluentColors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>📞 Call Center — Live</span>
              <button onClick={() => onNavigate('callcenter')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: FluentColors.primary, fontSize: 12 }}>Go to Call Center →</button>
            </div>
            <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, textAlign: 'center' }}>
              <div><div style={{ fontSize: 22, fontWeight: 700, color: FluentColors.success }}>{data.agents.filter(a => a.status === 'On Call').length}</div><div style={{ fontSize: 11, color: FluentColors.textSecondary }}>On Call</div></div>
              <div><div style={{ fontSize: 22, fontWeight: 700, color: FluentColors.primary }}>{data.agents.filter(a => a.status === 'Available').length}</div><div style={{ fontSize: 11, color: FluentColors.textSecondary }}>Available</div></div>
              <div><div style={{ fontSize: 22, fontWeight: 700, color: FluentColors.textMuted }}>{data.agents.filter(a => a.status === 'Break').length}</div><div style={{ fontSize: 11, color: FluentColors.textSecondary }}>On Break</div></div>
            </div>
            {data.agents.map(a => (
              <div key={a.id} style={{ padding: '8px 16px', borderTop: `1px solid ${FluentColors.bg}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar initials={a.name.split(' ').map(x=>x[0]).join('')} color={FluentColors.primary} size={28} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 500 }}>{a.name}</div></div>
                <Badge label={a.status} />
              </div>
            ))}
          </div>

          {/* Due Soon */}
          <div style={{ background: FluentColors.surface, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${FluentColors.border}` }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>⚠️ Due This Week</span>
            </div>
            {data.cases.filter(c => c.status !== 'Closed').map(c => (
              <div key={c.id} style={{ padding: '10px 16px', borderBottom: `1px solid ${FluentColors.bg}`, display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{c.id}</div>
                  <div style={{ fontSize: 11, color: FluentColors.textSecondary }}>{c.type} · {c.assignedTo}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: FluentColors.error, fontWeight: 600 }}>Due {c.dueDate}</div>
                  <Badge label={c.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

window.Dashboard = Dashboard;
