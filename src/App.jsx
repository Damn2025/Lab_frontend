import { useEffect, useState } from "react";
import { fetchConfig, fetchTableData, fetchLabTests } from "./api";
import { fallbackConfig } from "./fallbackConfig";

function getDefaultSort(config) {
  return config?.defaultSort || { column: config?.columns?.[0] || "", ascending: true };
}

function createInitialFilters() {
  return {
    state: "",
    labName: "",
    product: ""
  };
}

function renderField(fieldKey, fieldConfig, value, onChange, onRemove) {
  if (fieldConfig.type === "dropdown") {
    return (
      <div className="filter-card" key={fieldKey}>
        <label className="field">
          <span>{fieldConfig.label}</span>
          <select value={value} onChange={(event) => onChange(fieldKey, event.target.value)}>
            <option value="">All</option>
            {(fieldConfig.options || []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <button
          className="remove-filter-button"
          type="button"
          aria-label={`Remove ${fieldConfig.label} filter`}
          onClick={() => onRemove(fieldKey)}
        >
          x
        </button>
      </div>
    );
  }

  return (
    <div className="filter-card" key={fieldKey}>
      <label className="field">
        <span>{fieldConfig.label}</span>
        <input
          type="text"
          value={value}
          placeholder={`Type ${fieldConfig.label}`}
          onChange={(event) => onChange(fieldKey, event.target.value)}
        />
      </label>
      <button
        className="remove-filter-button"
        type="button"
        aria-label={`Remove ${fieldConfig.label} filter`}
        onClick={() => onRemove(fieldKey)}
      >
        x
      </button>
    </div>
  );
}

// Enhanced component for displaying detailed lab information
function LabDetailCard({ lab, onClose }) {
  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);

  useEffect(() => {
    async function loadTests() {
      if (lab && lab.__source && lab.labId) {
        setLoadingTests(true);
        try {
          const fetchedTests = await fetchLabTests(lab.__source, lab.labId);
          setTests(fetchedTests);
        } catch (error) {
          console.error("Failed to load tests", error);
        } finally {
          setLoadingTests(false);
        }
      }
    }
    loadTests();
  }, [lab]);

  if (!lab) return null;

  // Build a comprehensive field list from the lab data
  const basicInfo = [
    { label: "Lab Name", value: lab["Lab Name"] || lab["LaboratoryName"] },
    { label: "Address", value: lab["Address"] || lab["PrimeAddress"] },
    { label: "City", value: lab["City"] },
    { label: "State", value: lab["State"] },
    { label: "Pin Code", value: lab["Pin"] },
  ];

  const labDetails = [
    { label: "Discipline", value: lab["Discipline Name"] },
    { label: "Group", value: lab["Group Name"] },
    { label: "Lab Type", value: lab["Lab Type"] || lab["labType"] },
  ];

  const contactInfo = [
    { label: "Phone", value: lab["Phone Number"] || lab["ContactMobile"] || lab["LandLine"] },
    { label: "Email", value: lab["Email"] || lab["ContactEmail"] },
    { label: "Website", value: lab["Website"] || lab["webSite"] },
  ];

  // Collect any additional fields
  const additionalFields = [];
  const skipKeys = ["Lab Name", "LaboratoryName", "Address", "PrimeAddress", "City", "State", "Pin", "Discipline Name", "Group Name", "Lab Type", "labType", "Phone Number", "ContactMobile", "LandLine", "Email", "ContactEmail", "Website", "webSite", "Sr. No", "labId", "__source"];
  
  Object.entries(lab).forEach(([key, value]) => {
    if (value && !skipKeys.includes(key) && typeof value === "string" && value.length > 0 && value !== "-") {
      additionalFields.push({ label: key, value });
    }
  });

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 9999,
    animation: "fadeIn 0.2s ease-out"
  };

  const drawerStyle = {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#162635",
    boxShadow: "-10px 0 30px rgba(0, 0, 0, 0.5)",
    borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#f7f1e8",
    overflowY: "auto",
    zIndex: 10000,
    animation: "slideInRight 0.3s ease-out",
    display: "flex",
    flexDirection: "column"
  };

  const renderFieldGroup = (title, fields) => {
    const filtered = fields.filter(f => f.value);
    if (filtered.length === 0) return null;
    return (
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#52d3c8", marginBottom: "12px", borderBottom: "1px solid rgba(82, 211, 200, 0.3)", paddingBottom: "8px" }}>
          {title}
        </h3>
        <div style={{ display: "grid", gap: "10px" }}>
          {filtered.map((field, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 12px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }}>
              <span style={{ color: "#a9bac8", fontSize: "0.9rem" }}>{field.label}</span>
              <span style={{ color: "#f7f1e8", fontSize: "0.95rem", textAlign: "right", maxWidth: "60%", wordBreak: "break-word" }}>{field.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
      <div style={overlayStyle} onClick={onClose} />
      <div style={drawerStyle}>
        <div style={{ position: "sticky", top: 0, backgroundColor: "#162635", zIndex: 10, padding: "20px 30px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.25rem", color: "#ffbf69", margin: 0, paddingRight: "20px" }}>
            {lab["Lab Name"] || lab["LaboratoryName"] || "Lab Details"}
          </h2>
          <button 
            onClick={onClose}
            style={{ 
              border: "none", 
              background: "rgba(255,255,255,0.1)", 
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              fontSize: "1.25rem", 
              cursor: "pointer", 
              color: "#f7f1e8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              flexShrink: 0
            }}
            onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
            onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
          >
            ×
          </button>
        </div>
        
        <div style={{ padding: "30px", flex: 1 }}>
          {renderFieldGroup("Basic Information", basicInfo)}
          {renderFieldGroup("Lab Details", labDetails)}
          {renderFieldGroup("Contact Information", contactInfo)}
          
          {additionalFields.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#52d3c8", marginBottom: "12px", borderBottom: "1px solid rgba(82, 211, 200, 0.3)", paddingBottom: "8px" }}>
                Additional Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
                {additionalFields.map((field, idx) => (
                  <div key={idx} style={{ padding: "8px 12px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#a9bac8" }}>{field.label}</span>
                    <span style={{ color: "#f7f1e8", textAlign: "right", maxWidth: "60%", wordBreak: "break-word" }}>{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: "30px" }}>
            <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#52d3c8", marginBottom: "12px", borderBottom: "1px solid rgba(82, 211, 200, 0.3)", paddingBottom: "8px" }}>
              Tests & Methods
            </h3>
            {loadingTests ? (
              <p style={{ color: "#a9bac8", fontSize: "0.9rem", textAlign: "center", padding: "20px 0" }}>Loading tests...</p>
            ) : tests.length > 0 ? (
              (() => {
                const groupedData = {};
                tests.forEach(t => {
                  const product = t.product || "Other Tests";
                  const test = t.test;
                  
                  // Skip if there is no valid test name
                  if (!test || test.trim() === "") return;

                  let method = t.method ? t.method.replace(/\[.*?\]/g, '').trim() : "";

                  if (!groupedData[product]) {
                    groupedData[product] = {};
                  }
                  if (!groupedData[product][test]) {
                    groupedData[product][test] = new Set();
                  }
                  if (method) {
                    groupedData[product][test].add(method);
                  }
                });

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {Object.entries(groupedData).map(([product, testsObj], pIdx) => {
                      const testEntries = Object.entries(testsObj);
                      if (testEntries.length === 0) return null;

                      return (
                        <div key={pIdx} style={{ background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "8px", borderLeft: "3px solid #52d3c8" }}>
                          <h4 style={{ color: "#ffbf69", margin: "0 0 12px 0", fontSize: "1.05rem" }}>{product}</h4>
                          <ol style={{ margin: 0, paddingLeft: "20px", color: "#f7f1e8", fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                            {testEntries.map(([testName, methodsSet], tIdx) => (
                              <li key={tIdx} style={{ lineHeight: "1.4" }}>
                                <span style={{ fontWeight: "600", color: "#f7f1e8" }}>{testName}</span>
                                {methodsSet.size > 0 && (
                                  <span style={{ color: "#a9bac8", marginLeft: "6px" }}>
                                    [ {Array.from(methodsSet).join(", ")} ]
                                  </span>
                                )}
                              </li>
                            ))}
                          </ol>
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            ) : (
              <p style={{ color: "#a9bac8", fontSize: "0.9rem", textAlign: "center", padding: "20px 0", background: "rgba(0,0,0,0.1)", borderRadius: "8px" }}>
                No tests available for this lab.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


function App() {
  const [searchConfig, setSearchConfig] = useState(fallbackConfig);
  const [selectedLabType, setSelectedLabType] = useState("");
  const [filters, setFilters] = useState(createInitialFilters);
  const [activeFilterKeys, setActiveFilterKeys] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ column: "", ascending: true });
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [configLoading, setConfigLoading] = useState(true);

  // New states for the detail card
  const [showDetailCard, setShowDetailCard] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);

  const availableFilterEntries = Object.entries(searchConfig?.filterFields || {});
  const inactiveFilterEntries = availableFilterEntries.filter(
    ([fieldKey]) => !activeFilterKeys.includes(fieldKey)
  );
  const visibleFilterEntries = availableFilterEntries.filter(([fieldKey]) =>
    activeFilterKeys.includes(fieldKey)
  );

  const displayedColumns = columns.filter((column) => column !== "Address");

  useEffect(() => {
    async function loadConfig() {
      try {
        const payload = await fetchConfig();
        console.log("[Frontend] Received config payload:", payload);
        const preparedConfig = {
          ...fallbackConfig,
          ...payload.config,
          filterFields: {
            ...fallbackConfig.filterFields,
            ...payload.config.filterFields,
            state: {
              ...fallbackConfig.filterFields.state,
              ...payload.config.filterFields.state,
              options:
                Array.isArray(payload.config.stateOptions) &&
                payload.config.stateOptions.length > 0
                  ? payload.config.stateOptions
                  : fallbackConfig.filterFields.state.options
            }
          },
          labTypeOptions:
            Array.isArray(payload.config.labTypeOptions) &&
            payload.config.labTypeOptions.length > 0
              ? payload.config.labTypeOptions
              : fallbackConfig.labTypeOptions
        };

        setSearchConfig(preparedConfig);
        setSelectedLabType("");
        setLimit(preparedConfig.defaultLimit || 10);
        setSort(getDefaultSort(preparedConfig));
        setFilters(createInitialFilters());
        setActiveFilterKeys([]);
      } catch (loadError) {
        setSearchConfig(fallbackConfig);
        setSelectedLabType("");
        setLimit(fallbackConfig.defaultLimit || 10);
        setSort(getDefaultSort(fallbackConfig));
        setFilters(createInitialFilters());
        setActiveFilterKeys([]);
        setError(
          `${loadError.message} Showing local filter layout until the backend is available.`
        );
      } finally {
        setConfigLoading(false);
      }
    }

    loadConfig();
  }, []);

  useEffect(() => {
    setFilters(createInitialFilters());
    setActiveFilterKeys([]);
    setLimit(searchConfig.defaultLimit || 10);
    setPage(1);
    setSort(getDefaultSort(searchConfig));
    setRows([]);
    setColumns([]);
    setCount(0);
    setTotalPages(1);
    setError("");
  }, [selectedLabType]);

  async function handleLoadData(targetPage = 1) {
    setLoading(true);
    setError("");

    try {
      const payload = await fetchTableData({
        labType: selectedLabType,
        search: "",
        filters,
        limit,
        page: targetPage,
        sort
      });

      setRows(payload.rows);
      setColumns(payload.columns);
      setCount(payload.count);
      setPage(payload.page || targetPage);
      setTotalPages(payload.totalPages || 1);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function updateFilter(fieldKey, value) {
    setFilters((current) => ({
      ...current,
      [fieldKey]: value
    }));
  }

  function addFilterField(fieldKey) {
    setActiveFilterKeys((current) =>
      current.includes(fieldKey) ? current : [...current, fieldKey]
    );
  }

  function removeFilterField(fieldKey) {
    setActiveFilterKeys((current) => current.filter((key) => key !== fieldKey));
    setFilters((current) => ({
      ...current,
      [fieldKey]: ""
    }));
  }

  function resetFilters() {
    setFilters(createInitialFilters());
    setActiveFilterKeys([]);
    setPage(1);
    setRows([]);
    setColumns([]);
    setCount(0);
    setTotalPages(1);
    setError("");
  }

  // Handler for showing lab details
  function handleShowDetails(lab) {
    setSelectedLab(lab);
    setShowDetailCard(true);
  }

  if (configLoading) {
    return <div className="screen-message">Loading table configuration...</div>;
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Lab Discovery</p>
        <h1>LAB CARE PRO </h1>
        <p className="hero-copy">
           Find the right lab for your testing needs. Filter and explore our comprehensive database of labs, their services, and test catalogs to discover the perfect match for your requirements.
        </p>
      </section>

      <section className="panel controls-panel">
        <div className="control-deck">
          <div className="control-deck-header">
            <div>
              <p className="eyebrow">Search Controls</p>
              <h2 className="controls-title">Refine your lab discovery workflow</h2>
              <p className="controls-copy">
                Start broad, then layer filters only where they help.
              </p>
            </div>
            <button className="ghost-button" type="button" onClick={resetFilters}>
              Reset All
            </button>
          </div>

          <div className="control-grid">
            <label className="field spotlight-field">
              <span>Lab Type</span>
              <select
                value={selectedLabType}
                onChange={(event) => setSelectedLabType(event.target.value)}
              >
                <option value="">All Lab Types</option>
                {(searchConfig.labTypeOptions || []).map((labType) => (
                  <option key={labType} value={labType}>
                    {labType}
                  </option>
                ))}
              </select>
            </label>

            <label className="field compact-field">
              <span>Count</span>
              <input
                type="number"
                min="1"
                max="100"
                value={limit}
                onChange={(event) => setLimit(Number(event.target.value))}
              />
            </label>
          </div>
        </div>

        <div className="filter-toolbar">
          <div className="filter-toolbar-head">
            <span className="filter-toolbar-label">Optional Filters</span>
            <span className="filter-toolbar-copy">
              Add only the filters you want to use for this search.
            </span>
          </div>
          <div className="filter-chip-list">
            {inactiveFilterEntries.map(([fieldKey, fieldConfig]) => (
              <button
                key={fieldKey}
                className="filter-chip"
                type="button"
                onClick={() => addFilterField(fieldKey)}
              >
                {fieldConfig.label}
              </button>
            ))}
          </div>
        </div>

        {visibleFilterEntries.length > 0 ? (
          <div className="specific-filters">
            {visibleFilterEntries.map(([fieldKey, fieldConfig]) =>
              renderField(
                fieldKey,
                fieldConfig,
                filters[fieldKey] || "",
                updateFilter,
                removeFilterField
              )
            )}
          </div>
        ) : (
          <div className="empty-filter-state">
            <p>No active filters yet</p>
            <span>Use the buttons above to add filters to your search.</span>
          </div>
        )}

        <div className="actions">
          <button className="primary-button" type="button" onClick={() => handleLoadData(1)}>
            {loading ? "Loading..." : "Load Data"}
          </button>
        </div>

        {error ? <p className="error-banner">{error}</p> : null}
      </section>

      <section className="panel results-panel">
        <div className="results-header">
          <div>
            <p className="eyebrow">Results</p>
            <h2>{count} matching rows</h2>
            <p className="hero-copy">
              Page {page} of {totalPages}
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          {rows.length > 0 ? (
            <table>
              <thead>
                <tr>
                  {displayedColumns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${row.labId || row.labid || "row"}-${index}`}>
                    {displayedColumns.map((column) => (
                      <td key={`${column}-${index}`}>
                        {column === "Details" ? (
                          <button
                            className="details-icon-button"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowDetails(row);
                            }}
                            aria-label="Show details"
                            title="View full details"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                        ) : column === "Discipline Name" && row[column] && row[column] !== "-" ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {String(row[column]).split(",").map((val, i) => (
                              <span 
                                key={i} 
                                style={{ 
                                  display: "inline-block", 
                                  padding: "4px 12px", 
                                  borderRadius: "50px", 
                                  backgroundColor: "rgba(82, 211, 200, 0.1)", 
                                  border: "1px solid rgba(82, 211, 200, 0.3)",
                                  color: "#52d3c8",
                                  fontSize: "0.9rem",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                {val.trim()}
                              </span>
                            ))}
                          </div>
                        ) : (
                          row[column] === null || row[column] === undefined || row[column] === ""
                            ? "-"
                            : `${row[column]}`
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No data loaded yet.</p>
              <span>Choose a lab type, add filters, and load the matching rows.</span>
            </div>
          )}
        </div>

        <div className="pagination-bar">
          <button
            className="ghost-button"
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => handleLoadData(page - 1)}
          >
            Previous
          </button>
          <button
            className="ghost-button"
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => handleLoadData(page + 1)}
          >
            Next
          </button>
        </div>
      </section>

      {showDetailCard && (
        <LabDetailCard lab={selectedLab} onClose={() => setShowDetailCard(false)} />
      )}
    </main>
  );
}

export default App;
