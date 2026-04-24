
const WorkflowsModule = ({ data }) => {
  const [workflows, setWorkflows] = React.useState(data.workflows);
  const [selected, setSelected] = React.useState(data.workflows[0]);
  const [filter, setFilter] = React.useState('All');

  const filtered = workflows.filter(w => filter === 'All' || w.status === filter);

  const deptColors = {
    'Member Services': FluentColors.primary,
    'Utilization Management': FluentColors.warning,
    'Appeals & Grievances': FluentColors.purple,
    'Care Management': FluentColors.teal,
    'Provider Relations': FluentColors.success,
  };

  const advance = (wf) => {
    if (wf.currentStep >= wf.steps.length - 1) return;
    const updated = workflows.map(w => w.id === wf.id
      ? { ...w, currentStep: w.currentStep + 1, status: w.currentStep + 1 === w.steps.length - 1 ? 'Completed' : w.status }
      : w);
    setWorkflows(updated);
    setSelected(updated.find(w => w.id === wf.id));
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CommandBar title="Workflows" subtitle={`${workflows.length} workflows · ${workflows.filter(w=>w.status!=='Completed').length} active`}
        actions={[{ label: '+ New Workflow', primary: true }]} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* List */}
        <div style={{ width: 320, borderRight: `1px solid ${FluentColors.border}`, display: 'flex', flexDirection: 'column', background: FluentColors.surface }}>
          <div style={{ padding: '8px 12px', borderBottom: `1px solid ${FluentColors.border}` }}>
            <select value={filter} onChange={e => setFilter(e.target.value)}
              style={{ width: '100%', padding: '5px 8px', border: `1px solid ${FluentColors.border}`, borderRadius: 2, fontSize: 12 }}>
              {['All','In Progress','Pending Approval','Completed'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {filtered.map(w => {
              const pct = Math.round((w.currentStep / (w.steps.length - 1)) * 100);
              return (
                <div key={w.id} onClick={() => setSelected(w)}
                  style={{
                    padding: '12px 14px', borderBottom: `1px solid ${FluentColors.bg}`, cursor: 'pointer',
                    background: selected?.id === w.id ? FluentColors.primaryLight : 'transparent',
                    borderLeft: selected?.id === w.id ? `3px solid ${FluentColors.primary}` : '3px solid transparent',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: FluentColors.text }}>{w.name}</span>
                    <Badge label={w.status} />
                  </div>
                  <div style={{ fontSize: 11, color: FluentColors.textSecondary, marginBottom: 6 }}>
                    {w.member || w.provider} · {w.department}
                  </div>
                  <div style={{ height: 4, background: FluentColors.bgDark, borderRadius: 2, marginBottom: 4 }}>
                    <div style={{ height: 4, background: w.status === 'Completed' ? FluentColors.success : FluentColors.primary, borderRadius: 2, width: `${pct}%`, transition: 'width 0.4s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: FluentColors.textMuted }}>Step {w.currentStep + 1}/{w.steps.length}</span>
                    <span style={{ fontSize: 10, color: FluentColors.textMuted }}>Due {w.dueDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        {selected && (
          <div style={{ flex: 1, overflow: 'auto', background: FluentColors.bg }}>
            <div style={{ padding: '16px 20px', background: FluentColors.surface, borderBottom: `1px solid ${FluentColors.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.name}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 6, alignItems: 'center' }}>
                    <Badge label={selected.status} />
                    <span style={{ fontSize: 12, color: FluentColors.textSecondary }}>{selected.department}</span>
                    <span style={{ fontSize: 12, color: FluentColors.textSecondary }}>Assigned: {selected.assignedTo}</span>
                    <span style={{ fontSize: 12, color: FluentColors.textSecondary }}>Due: {selected.dueDate}</span>
                  </div>
                </div>
                {selected.status !== 'Completed' && (
                  <button onClick={() => advance(selected)}
                    style={{ padding: '7px 18px', background: FluentColors.primary, color: '#fff', border: 'none', borderRadius: 2, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                    → Advance Step
                  </button>
                )}
              </div>
            </div>

            <div style={{ padding: 20 }}>
              {/* Step Tracker */}
              <div style={{ background: FluentColors.surface, padding: 24, border: `1px solid ${FluentColors.border}`, borderRadius: 4, marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 20 }}>Workflow Progress</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                  {selected.steps.map((step, i) => {
                    const done = i < selected.currentStep;
                    const active = i === selected.currentStep;
                    const future = i > selected.currentStep;
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        {i < selected.steps.length - 1 && (
                          <div style={{ position: 'absolute', top: 14, left: '50%', right: '-50%', height: 3, background: done ? FluentColors.primary : FluentColors.bgDark, zIndex: 0 }} />
                        )}
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', zIndex: 1,
                          background: done ? FluentColors.primary : active ? FluentColors.primary : FluentColors.surface,
                          border: `3px solid ${done || active ? FluentColors.primary : FluentColors.borderDark}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: done || active ? '#fff' : FluentColors.textMuted,
                          fontSize: 12, fontWeight: 700,
                          boxShadow: active ? `0 0 0 4px ${FluentColors.primaryLight}` : 'none',
                        }}>
                          {done ? '✓' : i + 1}
                        </div>
                        <div style={{ fontSize: 11, textAlign: 'center', marginTop: 8, fontWeight: active ? 700 : 400, color: active ? FluentColors.primary : done ? FluentColors.text : FluentColors.textMuted, maxWidth: 90 }}>
                          {step}
                        </div>
                        {active && <div style={{ fontSize: 10, color: FluentColors.primary, fontWeight: 600, marginTop: 2 }}>Current</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: FluentColors.surface, padding: 16, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
                  <Section title="Workflow Details">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <FormField label="Workflow ID" value={selected.id} readOnly />
                      <FormField label="Status" value={selected.status} readOnly />
                      <FormField label="Department" value={selected.department} readOnly />
                      <FormField label="Assigned To" value={selected.assignedTo} readOnly />
                      <FormField label="Due Date" value={selected.dueDate} readOnly />
                      <FormField label="Current Step" value={`${selected.currentStep + 1} of ${selected.steps.length}`} readOnly />
                    </div>
                    {selected.member && <div style={{ marginTop: 12 }}><FormField label="Member" value={selected.member} readOnly /></div>}
                    {selected.provider && <div style={{ marginTop: 12 }}><FormField label="Provider" value={selected.provider} readOnly /></div>}
                  </Section>
                </div>
                <div style={{ background: FluentColors.surface, padding: 16, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
                  <Section title="All Steps">
                    {selected.steps.map((step, i) => {
                      const done = i < selected.currentStep;
                      const active = i === selected.currentStep;
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${FluentColors.bg}` }}>
                          <div style={{ width: 20, height: 20, borderRadius: '50%', background: done ? FluentColors.success : active ? FluentColors.primary : FluentColors.bgDark, color: done || active ? '#fff' : FluentColors.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                            {done ? '✓' : i + 1}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: done ? FluentColors.textSecondary : active ? FluentColors.primary : FluentColors.textMuted }}>
                            {step}
                          </div>
                          {done && <span style={{ fontSize: 10, color: FluentColors.success, marginLeft: 'auto' }}>Done</span>}
                          {active && <span style={{ fontSize: 10, color: FluentColors.primary, marginLeft: 'auto', fontWeight: 700 }}>Active</span>}
                        </div>
                      );
                    })}
                  </Section>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

window.WorkflowsModule = WorkflowsModule;
