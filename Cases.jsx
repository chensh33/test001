
const CasesModule = ({ data, initialMember, onClearInitialMember }) => {
  const [cases, setCases] = React.useState(data.cases);
  const [selected, setSelected] = React.useState(null);
  const [tab, setTab] = React.useState('Summary');
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [typeFilter, setTypeFilter] = React.useState('All');
  const [createModal, setCreateModal] = React.useState(false);
  const [newNote, setNewNote] = React.useState('');
  const [newCase, setNewCase] = React.useState({ memberName: '', type: 'Authorization', priority: 'Medium', department: 'Member Services', description: '', assignedTo: '' });

  React.useEffect(() => {
    if (initialMember) {
      setCreateModal(true);
      setNewCase(c => ({ ...c, memberName: initialMember.name }));
      onClearInitialMember();
    }
  }, [initialMember]);

  const filtered = cases.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.id.toLowerCase().includes(q) || c.memberName.toLowerCase().includes(q) || c.type.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchType = typeFilter === 'All' || c.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const handleAddNote = () => {
    if (!newNote.trim() || !selected) return;
    const note = { date: new Date().toISOString().slice(0,10), by: 'Current User', text: newNote };
    const updated = cases.map(c => c.id === selected.id ? { ...c, notes: [...c.notes, note] } : c);
    setCases(updated);
    setSelected(updated.find(c => c.id === selected.id));
    setNewNote('');
  };

  const handleStatusChange = (newStatus) => {
    const updated = cases.map(c => c.id === selected.id ? { ...c, status: newStatus } : c);
    setCases(updated);
    setSelected(updated.find(c => c.id === selected.id));
  };

  const handleCreateCase = () => {
    const id = `CS-2025-${String(cases.length + 50).padStart(4,'0')}`;
    const nc = { ...newCase, id, memberId: 'M999', createdDate: new Date().toISOString().slice(0,10), dueDate: '2025-05-05', status: 'Open', notes: [] };
    setCases(c => [nc, ...c]);
    setSelected(nc);
    setCreateModal(false);
    setNewCase({ memberName: '', type: 'Authorization', priority: 'Medium', department: 'Member Services', description: '', assignedTo: '' });
  };

  const statusFlow = ['Open', 'In Review', 'Pending', 'Closed'];
  const types = ['All','Authorization','Grievance','Appeal','Billing','Care Management','Complaint'];
  const statuses = ['All','Open','In Review','Pending','Closed'];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CommandBar title="Cases" subtitle={`${cases.length} total · ${cases.filter(c=>c.status!=='Closed').length} open`}
        actions={[{ label: '+ NewCase', primary: true, onClick: () => setCreateModal(true) }]} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* List */}
        <div style={{ width: 360, borderRight: `1px solid ${FluentColors.border}`, display: 'flex', flexDirection: 'column', background: FluentColors.surface }}>
          <div style={{ padding: '8px 12px', borderBottom: `1px solid ${FluentColors.border}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search cases..." />
            <div style={{ display: 'flex', gap: 6 }}>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ flex: 1, padding: '4px 6px', border: `1px solid ${FluentColors.border}`, borderRadius: 2, fontSize: 11 }}>
                {statuses.map(s => <option key={s}>{s}</option>)}
              </select>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                style={{ flex: 1, padding: '4px 6px', border: `1px solid ${FluentColors.border}`, borderRadius: 2, fontSize: 11 }}>
                {types.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {filtered.map(c => (
              <div key={c.id} onClick={() => { setSelected(c); setTab('Summary'); }}
                style={{
                  padding: '10px 14px', borderBottom: `1px solid ${FluentColors.bg}`, cursor: 'pointer',
                  background: selected?.id === c.id ? FluentColors.primaryLight : 'transparent',
                  borderLeft: selected?.id === c.id ? `3px solid ${FluentColors.primary}` : '3px solid transparent',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: FluentColors.primary }}>{c.id}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Badge label={c.priority} />
                    <Badge label={c.status} />
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: FluentColors.text, marginBottom: 2 }}>{c.memberName}</div>
                <div style={{ fontSize: 11, color: FluentColors.textSecondary, marginBottom: 4 }}>{c.type} · {c.department}</div>
                <div style={{ fontSize: 11, color: FluentColors.textMuted }}>Assigned: {c.assignedTo} · Due: {c.dueDate}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '8px 14px', borderTop: `1px solid ${FluentColors.border}`, fontSize: 11, color: FluentColors.textMuted }}>
            {filtered.length} of {cases.length} cases
          </div>
        </div>

        {/* Detail */}
        {selected ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', background: FluentColors.surface, borderBottom: `1px solid ${FluentColors.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: FluentColors.text }}>{selected.id}</div>
                  <div style={{ fontSize: 12, color: FluentColors.textSecondary, marginTop: 2 }}>{selected.memberName} · {selected.type} · {selected.department}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Badge label={selected.priority} />
                    <Badge label={selected.status} />
                    <span style={{ fontSize: 11, color: FluentColors.textMuted }}>Assigned: {selected.assignedTo}</span>
                    <span style={{ fontSize: 11, color: FluentColors.textMuted }}>Due: {selected.dueDate}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {statusFlow.filter(s => s !== selected.status).map(s => (
                    <button key={s} onClick={() => handleStatusChange(s)}
                      style={{ padding: '5px 12px', background: s === 'Closed' ? FluentColors.success : 'none', color: s === 'Closed' ? '#fff' : FluentColors.text, border: `1px solid ${FluentColors.borderDark}`, borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>
                      {s === 'Closed' ? '✓ Close' : `→ ${s}`}
                    </button>
                  ))}
                </div>
              </div>
              {/* Status pipeline */}
              <div style={{ marginTop: 12, display: 'flex', gap: 0 }}>
                {statusFlow.map((s, i) => {
                  const idx = statusFlow.indexOf(selected.status);
                  const done = i <= idx;
                  return (
                    <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                      <div style={{ flex: 1, height: 4, background: done ? FluentColors.primary : FluentColors.bgDark, borderRadius: i === 0 ? '2px 0 0 2px' : i === statusFlow.length-1 ? '0 2px 2px 0' : 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 4px' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: done ? FluentColors.primary : FluentColors.borderDark, border: `2px solid ${done ? FluentColors.primary : FluentColors.borderDark}` }} />
                        <div style={{ fontSize: 10, color: done ? FluentColors.primary : FluentColors.textMuted, marginTop: 3, whiteSpace: 'nowrap' }}>{s}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <Tabs tabs={['Summary','Notes','Related']} active={tab} onChange={setTab} />
            <div style={{ flex: 1, overflow: 'auto', padding: 20, background: FluentColors.bg }}>
              {tab === 'Summary' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: FluentColors.surface, padding: 16, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
                    <Section title="Case Details">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <FormField label="Case ID" value={selected.id} readOnly />
                        <FormField label="Type" value={selected.type} readOnly />
                        <FormField label="Priority" value={selected.priority} readOnly />
                        <FormField label="Status" value={selected.status} readOnly />
                        <FormField label="Department" value={selected.department} readOnly />
                        <FormField label="Assigned To" value={selected.assignedTo} readOnly />
                        <FormField label="Created" value={selected.createdDate} readOnly />
                        <FormField label="Due Date" value={selected.dueDate} readOnly />
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <FormField label="Description" value={selected.description} type="textarea" readOnly />
                      </div>
                    </Section>
                  </div>
                  <div style={{ background: FluentColors.surface, padding: 16, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
                    <Section title="Latest Activity">
                      {selected.notes.slice().reverse().slice(0,4).map((n,i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, paddingBottom: 12 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: FluentColors.primary, marginTop: 4, flexShrink: 0 }} />
                            {i < selected.notes.length - 1 && <div style={{ width: 1, flex: 1, background: FluentColors.border }} />}
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: FluentColors.textMuted }}>{n.date} · {n.by}</div>
                            <div style={{ fontSize: 12, color: FluentColors.text, marginTop: 2 }}>{n.text}</div>
                          </div>
                        </div>
                      ))}
                    </Section>
                  </div>
                </div>
              )}
              {tab === 'Notes' && (
                <div style={{ background: FluentColors.surface, border: `1px solid ${FluentColors.border}`, borderRadius: 4 }}>
                  <div style={{ padding: '10px 16px', borderBottom: `1px solid ${FluentColors.border}`, fontWeight: 600, fontSize: 13 }}>Case Notes</div>
                  <div style={{ padding: 16 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                      <textarea value={newNote} onChange={e => setNewNote(e.target.value)} rows={3}
                        placeholder="Add a note..."
                        style={{ flex: 1, padding: '8px 10px', border: `1px solid ${FluentColors.borderDark}`, borderRadius: 2, fontSize: 13, resize: 'none', fontFamily: 'inherit' }} />
                      <button onClick={handleAddNote} style={{ padding: '8px 16px', background: FluentColors.primary, color: '#fff', border: 'none', borderRadius: 2, cursor: 'pointer', fontSize: 12, alignSelf: 'flex-end' }}>Add</button>
                    </div>
                    {selected.notes.slice().reverse().map((n, i) => (
                      <div key={i} style={{ padding: '10px 0', borderTop: `1px solid ${FluentColors.bg}`, display: 'flex', gap: 10 }}>
                        <Avatar initials={n.by.split(' ').map(x=>x[0]).join('').slice(0,2)} color={FluentColors.primary} size={28} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 600 }}>{n.by} <span style={{ fontWeight: 400, color: FluentColors.textMuted }}>· {n.date}</span></div>
                          <div style={{ fontSize: 13, color: FluentColors.text, marginTop: 4 }}>{n.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab === 'Related' && <EmptyState icon="🔗" title="No related records" subtitle="Link cases, authorizations, or documents" />}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EmptyState icon="📋" title="Select a case" subtitle="Choose a case from the list to view details" />
          </div>
        )}
      </div>

      {/* Create Case Modal */}
      <Modal open={createModal} title="Create New Case" onClose={() => setCreateModal(false)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Member Name" value={newCase.memberName} onChange={v => setNewCase(c=>({...c,memberName:v}))} required />
          <FormField label="Case Type" value={newCase.type} onChange={v => setNewCase(c=>({...c,type:v}))} options={['Authorization','Grievance','Appeal','Billing','Care Management','Complaint']} required />
          <FormField label="Priority" value={newCase.priority} onChange={v => setNewCase(c=>({...c,priority:v}))} options={['Low','Medium','High']} />
          <FormField label="Department" value={newCase.department} onChange={v => setNewCase(c=>({...c,department:v}))} options={['Member Services','Utilization Management','Appeals & Grievances','Billing','Care Management','Provider Relations']} />
          <FormField label="Assigned To" value={newCase.assignedTo} onChange={v => setNewCase(c=>({...c,assignedTo:v}))} />
        </div>
        <div style={{ marginTop: 14 }}>
          <FormField label="Description" value={newCase.description} onChange={v => setNewCase(c=>({...c,description:v}))} type="textarea" required />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          <button onClick={() => setCreateModal(false)} style={{ padding: '7px 18px', background: 'none', border: `1px solid ${FluentColors.borderDark}`, borderRadius: 2, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
          <button onClick={handleCreateCase} style={{ padding: '7px 18px', background: FluentColors.primary, color: '#fff', border: 'none', borderRadius: 2, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Create Case</button>
        </div>
      </Modal>
    </div>
  );
};

window.CasesModule = CasesModule;
