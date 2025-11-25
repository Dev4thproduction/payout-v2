  import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Loading from './Loading';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const Table = ({
  data = [],
  columns = [],
  loading = false,
  pagination,
  onPageChange,
  actions,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  emptyMessage = "No data found.",
  currentPage = 1,
  renderCell = null   // ✅ ADD THIS
}) => {

  if (loading) {
    return (
      <div className="py-12">
        <Loading />
      </div>
    );
  }

  const handleSelectionChange = (e) => {
    if (onSelectionChange) {
      onSelectionChange(e.value);
    }
  };

  const actionBodyTemplate = (rowData) => {
    if (!actions) return null;

    return (
      <div className="flex items-center gap-2">
        {actions.map((action, actionIndex) => (
          <button
            key={actionIndex}
            onClick={() => action.onClick(rowData)}
            className={action.className}
            title={action.title}
            disabled={action.disabled}
          >
            {action.icon || action.text}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="overflow-hidden" style={{ width: '100vw', maxWidth: '100%' }}>
      <style jsx>{`
  .custom-datatable .p-datatable-tbody > tr > td,
  .custom-datatable .p-datatable-thead > tr > th {
    padding: 0.75rem 1rem !important; /* More vertical & horizontal padding */
    height: 44px !important;          /* Taller rows */
    font-size: 14.5px;
    min-width: 180px;
  }

  .custom-datatable .p-selection-column .p-column-header-content,
  .custom-datatable .p-selection-column .p-cell-content {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }

  .custom-datatable .p-checkbox .p-checkbox-box {
    background-color: white !important;
    border: 2px solid black !important;
    width: 20px !important;
    height: 20px !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custom-datatable .p-checkbox .p-checkbox-box.p-highlight {
    background-color: black !important;
    border-color: black !important;
  }

  .custom-datatable .p-checkbox .p-checkbox-icon {
    color: black !important;
    font-size: 13px !important;
    display: inline-block !important;
    visibility: visible !important;
    width: auto !important;
    height: auto !important;
    content: unset !important;
  }
`}</style>

      <DataTable
        value={data}
        loading={loading}
        selection={selectedRows}
        onSelectionChange={handleSelectionChange}
        selectionMode={selectable ? "multiple" : null}
        dataKey="_id"
        paginator={pagination && pagination.totalRecords > 10}
        rows={10}
        totalRecords={pagination?.totalRecords}
        lazy={false}
        first={pagination ? (currentPage - 1) * 10 : 0}
        onPage={(e) => onPageChange && onPageChange(e.page + 1)}
        emptyMessage={emptyMessage}
        className="p-datatable-gridlines p-datatable-sm custom-datatable"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
        size="small"
        tableStyle={{ minWidth: '150%', width: '150%' }}
      >
        {/* Selection Column */}
        {selectable && (
          <Column
            selectionMode="multiple"
            headerStyle={{ width: '50px', textAlign: 'center' }}
            bodyStyle={{ width: '50px', textAlign: 'center' }}
            style={{ width: '50px', textAlign: 'center' }}
            // frozen
            body={(rowData, options) => {
              return (
                <div className="p-checkbox-box p-highlight">
                  <span className="p-checkbox-icon pi pi-check" />
                </div>
              );
            }}
          />
        )}

        {/* Dynamic Columns with fallback "-" */}
        {columns.map((column, index) => {
          const defaultBody = (rowData) => {
            let value = typeof column.body === "function"
              ? column.body(rowData)
              : rowData[column.field];

            // ✅ Format 'date' and 'date_2' as DD-MM-YYYY
            // ✅ Format 'date', 'date_2', 'punch_date' as DD-MM-YYYY
            if (['date', 'date_2', 'punch_date'].includes(column.field) && value) {
              try {
                const d = new Date(value);
                if (!isNaN(d)) {
                  const day = String(d.getDate()).padStart(2, '0');
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  const year = String(d.getFullYear()).slice(-2); // use full year if needed
                  value = `${day}-${month}-${year}`;
                }
              } catch (err) {
                value = 'Invalid Date';
              }
            }


            // ✅ Format 'datetime' as DD-MM-YY hh:mm AM/PM
            if (column.field === 'datetime' && value) {
              try {
                const d = new Date(value);
                if (!isNaN(d)) {
                  const day = String(d.getDate()).padStart(2, '0');
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  const year = String(d.getFullYear()).slice(-2);
                  let hours = d.getHours();
                  const minutes = String(d.getMinutes()).padStart(2, '0');
                  const ampm = hours >= 12 ? 'PM' : 'AM';
                  hours = hours % 12 || 12; // convert to 12-hour format
                  value = `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
                }
              } catch (err) {
                value = 'Invalid DateTime';
              }
            }

            // ✅ Format 'time' as hh:mm AM/PM
            if (column.field === 'time' && value) {
              try {
                const d = new Date(`1970-01-01T${value}`);
                if (!isNaN(d)) {
                  let hours = d.getHours();
                  const minutes = String(d.getMinutes()).padStart(2, '0');
                  const ampm = hours >= 12 ? 'PM' : 'AM';
                  hours = hours % 12 || 12;
                  value = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
                }
              } catch (err) {
                value = 'Invalid Time';
              }
            }

            return value === undefined || value === null || value === '' ? '-' : value;
          };

          return (
            <Column
              key={index}
              field={column.field}
              header={column.header}
              sortable={true}                // ✅ force sorting
              sortField={column.field}      // ✅ required for sorting when using body
              body={defaultBody}
              style={{ minWidth: '150px', ...(column.style || {}) }}
              headerStyle={{ minWidth: '150px', ...(column.headerStyle || {}) }}
              className={column.className}
            />
          );
        })}


        {/* Actions Column */}
        {actions && (
          <Column
            header="Actions"
            body={actionBodyTemplate}
            style={{ minWidth: '160px' }}
            headerStyle={{ textAlign: 'center', minWidth: '160px' }}
            bodyStyle={{ textAlign: 'center' }}
            frozen
            alignFrozen="right"
          />
        )}
      </DataTable>
    </div>
  );
};

export default Table;
