import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Download, Calendar } from 'lucide-react';
import './Analytics.css';

const generateDynamicData = (category, count) => {
  const trends = [];
  const revenue = [];
  
  const today = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const labels = {
    DAILY: (i) => {
      const d = new Date();
      d.setDate(today.getDate() - (count - 1 - i));
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    },
    WEEKLY: (i) => `Week ${i + 1}`,
    MONTHLY: (i) => {
      const d = new Date();
      d.setMonth(today.getMonth() - (count - 1 - i));
      return monthNames[d.getMonth()];
    },
    YEARLY: (i) => (today.getFullYear() - (count - 1 - i)).toString()
  };

  const revenueLabels = labels;

  for (let i = 0; i < count; i++) {
    trends.push({
      label: labels[category](i),
      completed: Math.floor(Math.random() * 50) + 50,
      pending: Math.floor(Math.random() * 20) + 5
    });
    
    revenue.push({
      label: revenueLabels[category](i),
      revenue: Math.floor(Math.random() * 5000) + 2000
    });
  }

  const baseStats = {
    DAILY: { volume: 20, revenue: 1000, efficiency: 90 },
    WEEKLY: { volume: 150, revenue: 8000, efficiency: 92 },
    MONTHLY: { volume: 600, revenue: 30000, efficiency: 94 },
    YEARLY: { volume: 2500, revenue: 120000, efficiency: 95 }
  };

  const currentMult = count * (0.9 + Math.random() * 0.2);
  const prevMult = count * (0.8 + Math.random() * 0.2);

  return {
    trends,
    revenue,
    categories: [
      { name: 'Blood Test', value: 45 * count, color: '#58a6ff' },
      { name: 'Lipid Profile', value: 30 * count, color: '#3fb950' },
      { name: 'Thyroid', value: 20 * count, color: '#e3b341' },
      { name: 'Urinalysis', value: 15 * count, color: '#a371f7' },
      { name: 'Other', value: 10 * count, color: '#f78166' }
    ],
    stats: {
      volume: { 
        current: Math.floor(baseStats[category].volume * currentMult), 
        previous: Math.floor(baseStats[category].volume * prevMult), 
        unit: 'Tests' 
      },
      revenue: { 
        current: Math.floor(baseStats[category].revenue * currentMult), 
        previous: Math.floor(baseStats[category].revenue * prevMult), 
        unit: '$' 
      },
      efficiency: { 
        current: Math.min(99, Math.floor(baseStats[category].efficiency + Math.random() * 5)), 
        previous: Math.floor(baseStats[category].efficiency), 
        unit: '%' 
      }
    }
  };
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip glass-panel">
        <p className="label">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, margin: 0, fontSize: '0.85rem' }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const timeframeOptions = {
    DAILY: { label: 'Daily View', unitPrefix: 'Last', unit: 'Days', counts: [1, 2, 3, 4, 5, 6] },
    WEEKLY: { label: 'Weekly View', unitPrefix: 'Last', unit: 'Weeks', counts: [1, 2, 3, 4, 5] },
    MONTHLY: { label: 'Monthly View', unitPrefix: 'Last', unit: 'Months', counts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
    YEARLY: { label: 'Yearly View', unitPrefix: 'Last', unit: 'Years', counts: [1, 2, 3, 4, 5] }
  };

  const [selection, setSelection] = React.useState({ category: 'MONTHLY', count: 6 });
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState(null);
  const dropdownRef = React.useRef(null);

  const data = React.useMemo(() => 
    generateDynamicData(selection.category, selection.count),
    [selection.category, selection.count]
  );

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setActiveCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculateChange = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  const formatSelectionLabel = () => {
    const opt = timeframeOptions[selection.category];
    const unitText = selection.count === 1 ? opt.unit.slice(0, -1) : opt.unit;
    return `${opt.unitPrefix} ${selection.count} ${unitText}`;
  };

  return (
    <div className="analytics-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p>Key performance metrics for {formatSelectionLabel()}.</p>
        </div>
        <div className="analytics-actions">
          <div className="custom-dropdown-wrapper" ref={dropdownRef}>
            <button className="icon-btn-text" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <Calendar size={18} /> {formatSelectionLabel()}
            </button>
            {isDropdownOpen && (
              <div className="nested-dropdown glass-panel animate-fade-in">
                <div className="dropdown-layout">
                  <div className="dropdown-section category-list">
                    <span className="section-title">Period</span>
                    {Object.keys(timeframeOptions).map((key) => (
                      <button 
                        key={key} 
                        className={`dropdown-item category-item ${activeCategory === key ? 'active' : ''} ${selection.category === key && !activeCategory ? 'selected' : ''}`}
                        onMouseEnter={() => setActiveCategory(key)}
                        onClick={() => setActiveCategory(key)}
                      >
                        {timeframeOptions[key].label}
                        <span className="chevron-right">›</span>
                      </button>
                    ))}
                  </div>
                  
                  {(activeCategory || selection.category) && (
                    <div className="dropdown-section count-list animate-slide-in-right">
                      <span className="section-title">Show Previous</span>
                      {timeframeOptions[activeCategory || selection.category].counts.map((cnt) => (
                        <button 
                          key={cnt} 
                          className={`dropdown-item ${selection.count === cnt && selection.category === (activeCategory || selection.category) ? 'active' : ''}`}
                          onClick={() => {
                            setSelection({ 
                              category: activeCategory || selection.category, 
                              count: cnt 
                            });
                            setIsDropdownOpen(false);
                            setActiveCategory(null);
                          }}
                        >
                          Last {cnt} {timeframeOptions[activeCategory || selection.category].unit}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button className="primary-btn">
            <Download size={18} /> Export Data
          </button>
        </div>
      </div>

      <div className="stats-comparison-row">
        {Object.entries(data.stats).map(([key, stat]) => {
          const change = calculateChange(stat.current, stat.previous);
          return (
            <div key={key} className="stat-card glass-panel">
              <span className="stat-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <div className="stat-value-row">
                <h2 className="stat-main-value">
                  {stat.unit === '$' ? `$${stat.current.toLocaleString()}` : `${stat.current}${stat.unit}`}
                </h2>
                <span className={`comparison-badge ${change.isPositive ? 'positive' : 'negative'}`}>
                  {change.isPositive ? '↑' : '↓'} {change.value}%
                </span>
              </div>
              <p className="stat-subtext">vs previous {selection.category.toLowerCase()}</p>
            </div>
          );
        })}
      </div>

      <div className="analytics-grid">
        <div className="chart-card glass-panel span-2">
          <div className="chart-header">
            <h3>Test Volume Trends</h3>
            <p>Completed vs Pending reports for the selected period</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trends} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="label" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="completed" name="Completed" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="pending" name="Pending" fill="var(--accent-secondary)" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card glass-panel">
          <div className="chart-header">
            <h3>Tests by Category</h3>
            <p>Distribution of test types</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" layout="vertical" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card glass-panel span-3">
          <div className="chart-header">
            <h3>Revenue Overview</h3>
            <p>Estimated revenue generation over the selected period</p>
          </div>
          <div className="chart-container" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.revenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="label" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue ($)" 
                  stroke="var(--accent-success)" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--bg-surface)", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "var(--accent-success)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
