import { useEffect, useState } from "react";
import { fetchConfig, fetchTableData } from "./api";
import { fallbackConfig } from "./fallbackConfig";

function getDefaultSort(config) {
  return config?.defaultSort || { column: config?.columns?.[0] || "", ascending: true };
}

function createInitialFilters() {
  return {
    state: "",
    city: "",
    labName: "",
    product: "",
    test: "",
    testMethod: ""
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

  const availableFilterEntries = Object.entries(searchConfig?.filterFields || {});
  const inactiveFilterEntries = availableFilterEntries.filter(
    ([fieldKey]) => !activeFilterKeys.includes(fieldKey)
  );
  const visibleFilterEntries = availableFilterEntries.filter(([fieldKey]) =>
    activeFilterKeys.includes(fieldKey)
  );

  useEffect(() => {
    async function loadConfig() {
      try {
        const payload = await fetchConfig();
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
        setLimit(preparedConfig.defaultLimit || 50);
        setSort(getDefaultSort(preparedConfig));
        setFilters(createInitialFilters());
        setActiveFilterKeys([]);
      } catch (loadError) {
        setSearchConfig(fallbackConfig);
        setSelectedLabType("");
        setLimit(fallbackConfig.defaultLimit || 50);
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
    setLimit(searchConfig.defaultLimit || 50);
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
            <span>
              Keep the search broad, or add filters above to narrow by location, lab name,
              product, or test details.
            </span>
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
                  {columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${row.labId || row.labid || "row"}-${index}`}>
                    {columns.map((column) => (
                      <td key={`${column}-${index}`}>
                        {row[column] === null || row[column] === undefined || row[column] === ""
                          ? "-"
                          : `${row[column]}`}
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
    </main>
  );
}

export default App;
