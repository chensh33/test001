
const MembersModule = ({ data, onCreateCase }) => {
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState(data.members[0]);
  const [tab, setTab] = React.useState('Summary');
  const [statusFilter, setStatusFilter] = React.useState('All');

  const filtered = data.members.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.memberId.toLowerCase().includes(q) || m.phone.includes(q);
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const memberCases = data.cases.filter(c => c.memberId === selected?.id);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CommandBar title="Members" subtitle={`${data.members.length} records`}
        actions={[{ label: '+ New Member', primary: true }]} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* List Panel */}
        <div style={{ width: 320, borderRight: `1px solid ${FluentColors.border}`, display: 'flex', flexDirection: 'column', background: FluentColors.surface }}>
          <div style={{ padding: '8px 12px', borderBottom: `1px solid ${FluentColors.border}`, display: 'flex', gap: 8 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search members..." />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '5px 8px', border: `1px solid ${FluentColors.border}`, borderRadius: 2, fontSize: 12, color: FluentColors.textSecondary }}>
              {['All','Active','Inactive','Pending'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {filtered.map(m => (
              <div key={m.id} onClick={() => { setSelected(m); setTab('Summary'); }}
                style={{
                  padding: '10px 14px', borderBottom: `1px solid ${FluentColors.bg}`,
                  cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center',
                  background: selected?.id === m.id ? FluentColors.primaryLight : 'transparent',
                  borderLeft: selected?.id === m.id ? `3px solid ${FluentColors.primary}` : '3px solid transparent',
                }}>
                <Avatar initials={m.avatar} color={m.color} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: FluentColors.text }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: FluentColors.textSecondary }}>{m.memberId} · {m.plan}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
                    <Badge label={m.status} />
                    {m.openCases > 0 && <span style={{ fontSize: 10, color: FluentColors.error, fontWeight: 600 }}>{m.openCases} open case{m.openCases > 1 ? 's' : ''}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '8px 14px', borderTop: `1px solid ${FluentColors.border}`, fontSize: 11, color: FluentColors.textMuted }}>
            {filtered.length} of {data.members.length} records
          </div>
        </div>

        {/* Detail Panel */}
        {selected ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '14px 20px', background: FluentColors.surface, borderBottom: `1px solid ${FluentColors.border}` }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <Avatar initials={selected.avatar} color={selected.color} size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: FluentColors.text }}>{selected.name}</div>
                  <div style={{ fontSize: 12, color: FluentColors.textSecondary, marginTop: 2 }}>
                    {selected.memberId} · {selected.plan}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <Badge label={selected.status} />
                    <span style={{ fontSize: 11, color: FluentColors.textSecondary }}>PCP: {selected.pcp}</span>
                    <span style={{ fontSize: 11, color: FluentColors.textSecondary }}>Group: {selected.group}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => onCreateCase(selected)} style={{ padding: '6px 14px', background: FluentColors.primary, color: '#fff', border: 'none', borderRadius: 2, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>+ New Case</button>
                  <button style={{ padding: '6px 14px', background: 'none', border: `1px solid ${FluentColors.borderDark}`, borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>📞 Log Call</button>
                  <button style={{ padding: '6px 14px', background: 'none', border: `1px solid ${FluentColors.borderDark}`, borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>✏️ Edit</button>
                </div>
              </div>
            </div>
            <Tabs tabs={['Summary','Cases','Timeline','Documents']} active={tab} onChange={setTab} />
            <div style={{ flex: 1, overflow: 'auto', padding: 20, background: FluentColors.bg }}>
              {tab === 'Summary' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: FluentColors.surface, padding: 16, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
                    <Section title="Member Information">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <FormField label="First Name" value={selected.name.split(' ')[0]} readOnly />
                        <FormField label="Last Name" value={selected.name.split(' ').slice(1).join(' ')} readOnly />
                        <FormField label="Date of Birth" value={selected.dob} readOnly />
                        <FormField label="Member ID" value={selected.memberId} readOnly />
                        <FormField label="Language" value={selected.language} readOnly />
                        <FormField label="Phone" value={selected.phone} readOnly />
                        <FormField label="Email" value={selected.email} readOnly />
                        <FormField label="Last Contact" value={selected.lastContact} readOnly />
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <FormField label="Address" value={selected.address} readOnly />
                      </div>
                    </Section>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ background: FluentColors.surface, padding: 16, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
                      <Section title="Coverage & Plan">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <FormField label="Plan" value={selected.plan} readOnly />
                          <FormField label="Status" value={selected.status} readOnly />
                          <FormField label="Group" value={selected.group} readOnly />
                          <FormField label="PCP" value={selected.pcp} readOnly />
                        </div>
                      </Section>
                    </div>
                    <div style={{ background: FluentColors.surface, padding: 16, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
                      <Section title="Open Cases">
                        {memberCases.filter(c => c.status !== 'Closed').length === 0
                          ? <div style={{ fontSize: 12, color: FluentColors.textMuted }}>No open cases.</div>
                          : memberCases.filter(c => c.status !== 'Closed').map(c => (
                            <div key={c.id} style={{ padding: '8px 0', borderBottom: `1px solid ${FluentColors.bg}`, display: 'flex', justifyContent: 'space-between' }}>
                              <div>
                                <div style={{ fontSize: 12, fontWeight: 600 }}>{c.id}</div>
                                <div style={{ fontSize: 11, color: FluentColors.textSecondary }}>{c.type} · {c.department}</div>
                              </div>
                              <div style={{ display: 'flex', gap: 4 }}>
                                <Badge label={c.priority} />
                                <Badge label={c.status} />
                              </div>
                            </div>
                          ))
                        }
                      </Section>
                    </div>
                  </div>
                </div>
              )}
              {tab === 'Cases' && (
                <div style={{ background: FluentColors.surface, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
                  <div style={{ padding: '10px 16px', borderBottom: `1px solid ${FluentColors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>All Cases — {selected.name}</span>
                    <button onClick={() => onCreateCase(selected)} style={{ padding: '5px 12px', background: FluentColors.primary, color: '#fff', border: 'none', borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>+ New Case</button>
                  </div>
                  {memberCases.length === 0 ? <EmptyState icon="📋" title="No cases found" subtitle="Create a new case for this member" /> :
                    memberCases.map(c => (
                      <div key={c.id} style={{ padding: '12px 16px', borderBottom: `1px solid ${FluentColors.bg}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: FluentColors.primary }}>{c.id}</span>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <Badge label={c.priority} />
                            <Badge label={c.status} />
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: FluentColors.text, marginBottom: 4 }}>{c.description}</div>
                        <div style={{ fontSize: 11, color: FluentColors.textSecondary }}>
                          {c.type} · {c.department} · Assigned: {c.assignedTo} · Due: {c.dueDate}
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
              {tab === 'Timeline' && (
                <div style={{ background: FluentColors.surface, border: `1px solid ${FluentColors.border}`, borderRadius: 4, padding: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>Activity Timeline</div>
                  {memberCases.flatMap(c => c.notes.map(n => ({ ...n, caseId: c.id }))).sort((a,b) => b.date.localeCompare(a.date)).map((n, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 16, position: 'relative' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: FluentColors.primary, marginTop: 3 }} />
                        <div style={{ width: 1, flex: 1, background: FluentColors.border }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: FluentColors.textMuted }}>{n.date} · {n.by} · <span style={{ color: FluentColors.primary }}>{n.caseId}</span></div>
                        <div style={{ fontSize: 13, color: FluentColors.text, marginTop: 2 }}>{n.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'Documents' && <EmptyState icon="📄" title="No documents attached" subtitle="Drag and drop or click to upload" />}
            </div>
          </div>
        ) : <EmptyState icon="👥" title="Select a member" subtitle="Choose a record from the list" />}
      </div>
    </div>
  );
};

window.MembersModule = MembersModule;
