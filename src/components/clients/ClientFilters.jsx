import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Wrench, User, X } from 'lucide-react';

const ClientFilters = ({
  searchQuery,
  onSearchChange,
  clients = [],
  onClientSelect
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter clients based on search query
  const filteredClients = searchQuery.length > 0 ? clients.filter(client =>
    (client.id && client.id.toString().includes(searchQuery)) ||
    (client.name && client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.address && client.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.phone && client.phone.includes(searchQuery))
  ).slice(0, 6) : [];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || filteredClients.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev < filteredClients.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev > 0 ? prev - 1 : filteredClients.length - 1
      );
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectClient(filteredClients[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleSelectClient = (client) => {
    onSearchChange(client.name);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    if (onClientSelect) {
      onClientSelect(client);
    }
  };

  const clearSearch = () => {
    onSearchChange('');
    setShowDropdown(false);
  };

  const controlBarStyle = {
    position: 'absolute',
    top: 85,
    left: 20,
    right: 20,
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    zIndex: 1500,
    flexWrap: 'wrap',
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.96)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(229, 231, 235, 0.8)',
    borderRadius: 12,
    padding: '12px 16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    minWidth: 'fit-content',
    transition: 'all 0.2s ease',
    cursor: 'default',
  };

  const searchContainerStyle = {
    ...cardStyle,
    flex: '1 1 auto',
    maxWidth: 500,
    position: 'relative',
    border: searchQuery ? '2px solid #3b82f6' : '1px solid rgba(229, 231, 235, 0.8)',
  };

  const searchInputStyle = {
    border: 'none',
    outline: 'none',
    fontSize: 14,
    background: 'transparent',
    width: '100%',
    minWidth: '300px',
    fontWeight: '500',
    color: '#1f2937',
  };

  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    background: 'white',
    border: '1px solid rgba(229, 231, 235, 0.8)',
    borderRadius: 12,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)',
    maxHeight: 320,
    overflowY: 'auto',
    zIndex: 1001,
  };

  const dropdownItemStyle = (isHighlighted) => ({
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.15s ease',
    backgroundColor: isHighlighted ? '#f3f4f6' : 'transparent',
  });

  return (
    <div style={controlBarStyle}>
      {/* Search with Autocomplete */}
      <div ref={searchRef} style={searchContainerStyle}>
        <Search size={18} color={searchQuery ? "#3b82f6" : "#6b7280"} />
        <input
          style={searchInputStyle}
          placeholder="Szukaj klienta (ID, nazwa, adres, telefon)..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setShowDropdown(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              color: '#6b7280',
            }}
          >
            <X size={16} />
          </button>
        )}

        {showDropdown && filteredClients.length > 0 && (
          <div ref={dropdownRef} style={dropdownStyle}>
            {filteredClients.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                style={dropdownItemStyle(index === highlightedIndex)}
                onClick={() => handleSelectClient(client)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <User size={16} color="#6b7280" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: 2 }}>
                      {client.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MapPin size={12} />
                      <span>{client.address}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <Wrench size={12} />
                      <span>{client.deviceType}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientFilters;
