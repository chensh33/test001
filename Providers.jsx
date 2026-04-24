
const ProvidersModule = ({ data }) => {
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState(data.providers[0]);
  const [tab, setTab] = React.useState('Summary');

  const filtered = data.providers.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.specialty.toLowerCase().includes(search.toLowerCase()) || p.npi.includes(search)
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CommandBar title="Providers" subtitle={`${data.providers.length} records`}
        actions={[{ label: '+ Add Provider', primary: true }]} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: 300, borderRight: `1px solid ${FluentColors.border}`, display: 'flex', flexDirection: 'column', background: FluentColors.surface }}>
          <div style={{ padding: '8px 12px', borderBottom: `1px solid ${FluentColors.border}` }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search providers..." />
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {filtered.map(p => (
              <div key={p.id} onClick={() => setSelected(p)}
                style={{
                  padding: '10px 14px', borderBottom: `1px solid ${FluentColors.bg}`,
                  cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center',
                  background: selected?.id === p.id ? FluentColors.primaryLight : 'transparent',
                  borderLeft: selected?.id === p.id ? `3px solid ${FluentColors.primary}` : '3px solid transparent',
                }}>
                <Avatar initials={p.avatar} color={p.color} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: FluentColors.textSecondary }}>{p.specialty}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <Badge label={p.status} />
                    <span style={{ fontSize: 10, color: FluentColors.textMuted }}>{p.memberCount} members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {selected && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', background: FluentColors.surface, borderBottom: `1px solid ${FluentColors.border}` }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <Avatar initials={selected.avatar} color={selected.color} size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.name}</div>
                  <div style={{ fontSize: 12, color: FluentColors.textSecondary, marginTop: 2 }}>{selected.specialty} · NPI: {selected.npi}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <Badge label={selected.status} />
                    <span style={{ fontSize: 11, color: FluentColors.textSecondary }}>{selected.group}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ padding: '6px 14px', background: 'none', border: `1px solid ${FluentColors.borderDark}`, borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>✏️ Edit</button>
                  <button style={{ padding: '6px 14px', background: 'none', border: `1px solid ${FluentColors.borderDark}`, borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>📋 Credentialing</button>
                </div>
              </div>
            </div>
            <Tabs tabs={['Summary','Members','Contracts']} active={tab} onChange={setTab} />
            <div style={{ flex: 1, overflow: 'auto', padding: 20, background: FluentColors.bg }}>
              {tab === 'Summary' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: FluentColors.surface, padding: 16, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
                    <Section title="Provider Information">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <FormField label="Name" value={selected.name} readOnly />
                        <FormField label="Specialty" value={selected.specialty} readOnly />
                        <FormField label="NPI" value={selected.npi} readOnly />
                        <FormField label="Phone" value={selected.phone} readOnly />
                        <FormField label="Email" value={selected.email} readOnly />
                        <FormField label="Status" value={selected.status} readOnly />
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <FormField label="Address" value={selected.address} readOnly />
                      </div>
                    </Section>
                  </div>
                  <div style={{ background: FluentColors.surface, padding: 16, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
                    <Section title="Network Stats">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={{ textAlign: 'center', padding: 12, background: FluentColors.bg, borderRadius: 4 }}>
                          <div style={{ fontSize: 28, fontWeight: 700, color: FluentColors.primary }}>{selected.memberCount}</div>
                          <div style={{ fontSize: 11, color: FluentColors.textSecondary }}>Assigned Members</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: 12, background: FluentColors.bg, borderRadius: 4 }}>
                          <div style={{ fontSize: 28, fontWeight: 700, color: FluentColors.success }}>94%</div>
                          <div style={{ fontSize: 11, color: FluentColors.textSecondary }}>Satisfaction Score</div>
                        </div>
                      </div>
                      <div style={{ marginTop: 12, padding: '10px 0', borderTop: `1px solid ${FluentColors.border}` }}>
                        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Network Group</div>
                        <div style={{ fontSize: 13, color: FluentColors.text }}>{selected.group}</div>
                      </div>
                    </Section>
                  </div>
                </div>
              )}
              {tab === 'Members' && (
                <div style={{ background: FluentColors.surface, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
                  <div style={{ padding: '10px 16px', borderBottom: `1px solid ${FluentColors.border}` }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>Members assigned to {selected.name}</span>
                  </div>
                  {data.members.filter(m => m.provider === selected.name).map(m => (
                    <div key={m.id} style={{ padding: '10px 16px', borderBottom: `1px solid ${FluentColors.bg}`, display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Avatar initials={m.avatar} color={m.color} size={30} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: FluentColors.textSecondary }}>{m.memberId} · {m.plan}</div>
                      </div>
                      <Badge label={m.status} />
                    </div>
                  ))}
                </div>
              )}
              {tab === 'Contracts' && <EmptyState icon="📄" title="Contract management" subtitle="No contracts on file" />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GroupsModule = ({ data }) => {
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState(data.groups[0]);

  const filtered = data.groups.filter(g =>
    !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.type.toLowerCase().includes(search.toLowerCase())
  );

  const typeColors = { Employer: FluentColors.primary, Government: FluentColors.success, Retiree: FluentColors.purple, Healthcare: FluentColors.teal };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CommandBar title="Groups" subtitle={`${data.groups.length} records`} actions={[{ label: '+ New Group', primary: true }]} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: 300, borderRight: `1px solid ${FluentColors.border}`, display: 'flex', flexDirection: 'column', background: FluentColors.surface }}>
          <div style={{ padding: '8px 12px', borderBottom: `1px solid ${FluentColors.border}` }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search groups..." />
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {filtered.map(g => (
              <div key={g.id} onClick={() => setSelected(g)}
                style={{
                  padding: '10px 14px', borderBottom: `1px solid ${FluentColors.bg}`,
                  cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center',
                  background: selected?.id === g.id ? FluentColors.primaryLight : 'transparent',
                  borderLeft: selected?.id === g.id ? `3px solid ${FluentColors.primary}` : '3px solid transparent',
                }}>
                <div style={{ width: 34, height: 34, borderRadius: 4, background: typeColors[g.type] || FluentColors.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏢</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{g.name}</div>
                  <div style={{ fontSize: 11, color: FluentColors.textSecondary }}>{g.type} · {g.memberCount} members</div>
                  <Badge label={g.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
        {selected && (
          <div style={{ flex: 1, overflow: 'auto', padding: 20, background: FluentColors.bg }}>
            <div style={{ background: FluentColors.surface, padding: 20, border: `1px solid ${FluentColors.border}`, borderRadius: 4, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.name}</div>
                  <div style={{ fontSize: 12, color: FluentColors.textSecondary, marginTop: 2 }}>{selected.type} Group · Effective {selected.effectiveDate}</div>
                  <div style={{ marginTop: 8 }}><Badge label={selected.status} /></div>
                </div>
                <button style={{ padding: '6px 14px', background: 'none', border: `1px solid ${FluentColors.borderDark}`, borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>✏️ Edit</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, padding: '16px 0', borderTop: `1px solid ${FluentColors.border}` }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: FluentColors.primary }}>{selected.memberCount}</div>
                  <div style={{ fontSize: 11, color: FluentColors.textSecondary }}>Total Members</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: FluentColors.success }}>98%</div>
                  <div style={{ fontSize: 11, color: FluentColors.textSecondary }}>Enrollment Rate</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: FluentColors.warning }}>3</div>
                  <div style={{ fontSize: 11, color: FluentColors.textSecondary }}>Open Cases</div>
                </div>
              </div>
            </div>
            <div style={{ background: FluentColors.surface, padding: 16, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
              <Section title="Group Details">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <FormField label="Group Name" value={selected.name} readOnly />
                  <FormField label="Type" value={selected.type} readOnly />
                  <FormField label="Primary Contact" value={selected.contact} readOnly />
                  <FormField label="Phone" value={selected.phone} readOnly />
                  <FormField label="Plan" value={selected.plan} readOnly />
                  <FormField label="Effective Date" value={selected.effectiveDate} readOnly />
                </div>
              </Section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

window.ProvidersModule = ProvidersModule;
window.GroupsModule = GroupsModule;
