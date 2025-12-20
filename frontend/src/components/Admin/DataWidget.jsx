// src/components/Admin/DataWidget.jsx

import React from 'react';

const DataWidget = ({ title, value, colorClass }) => {
  return (
    <div className={`data-widget ${colorClass}`}>
      <span className="widget-title">{title}</span>
      <span className="widget-value">{value}</span>
    </div>
  );
};

export default DataWidget;

/* --- Uso en AdminDashboard.jsx ---
<div class="data-widget-grid">
    <DataWidget title="Total Clientes" value="7" colorClass="widget-clientes-total" />
    <DataWidget title="Total Citas" value="7" colorClass="widget-citas-total" />
    <DataWidget title="Citas Aceptadas" value="6" colorClass="widget-aceptadas" />
    <DataWidget title="Ventas Hoy" value="$102" colorClass="widget-ventas-hoy" />
</div>
*/