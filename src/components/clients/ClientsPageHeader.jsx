import React from 'react';
import ClientsSearchFilters from './ClientsSearchFilters';

/**
 * Header component for ClientsPage containing search filters
 */
const ClientsPageHeader = ({
  searchQuery,
  onSearchChange,
  deviceTypeFilter,
  onDeviceTypeChange,
  inspectionFilter,
  onInspectionChange,
  confirmationFilter,
  onConfirmationChange,
  sortOption,
  onSortChange,
  resultsCount
}) => {
  return (
    <ClientsSearchFilters
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      deviceTypeFilter={deviceTypeFilter}
      onDeviceTypeChange={onDeviceTypeChange}
      inspectionFilter={inspectionFilter}
      onInspectionChange={onInspectionChange}
      confirmationFilter={confirmationFilter}
      onConfirmationChange={onConfirmationChange}
      sortOption={sortOption}
      onSortChange={onSortChange}
      resultsCount={resultsCount}
    />
  );
};

export default ClientsPageHeader;