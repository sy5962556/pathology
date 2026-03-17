import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Calendar } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import './Analytics.css';

const generateDynamicData = (category, count, actualTests = []) => {
  const trends = [];
  
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

  // Group tests by date for trends
  for (let i = 0; i < count; i++) {
    const label = labels[category](i);
    let completed = 0;
    let pending = 0;
    
    actualTests.forEach(test => {
      const testDate = new Date(test.date);
      let match = false;
      
      if (category === 'DAILY') {
        const d = new Date();
        d.setDate(today.getDate() - (count - 1 - i));
        match = testDate.toDateString() === d.toDateString();
      } else if (category === 'MONTHLY') {
        const d = new Date();
        d.setMonth(today.getMonth() - (count - 1 - i));
        match = testDate.getMonth() === d.getMonth() && testDate.getFullYear() === d.getFullYear();
      } else if (category === 'WEEKLY') {
        // Simple week numbering within the current month for seed/simple cases
        const currentMonth = today.getMonth();
        match = testDate.getMonth() === currentMonth && Math.floor(testDate.getDate() / 7) === i;
      }
      
      if (match) {
        if (test.status === 'Completed') completed++;
        else pending++;
      }
    });

    trends.push({
      label,
      completed,
      pending
    });
  }

  // Calculate actual categories
  const categoryCounts = actualTests.reduce((acc, test) => {
    acc[test.type] = (acc[test.type] || 0) + 1;
    return acc;
  }, {});

  const colors = ['#58a6ff', '#3fb950', '#e3b341', '#a371f7', '#f78166'];
  const categories = Object.entries(categoryCounts).map(([name, value], index) => ({
    name,
    value,
    color: colors[index % colors.length]
  }));

  if (categories.length === 0) {
    categories.push({ name: 'No Data', value: 0, color: 'var(--text-secondary)' });
  }

  const currentVolume = actualTests.length;
  const completedTests = actualTests.filter(t => t.status === 'Completed').length;
  const efficiency = actualTests.length > 0 ? Math.round((completedTests / actualTests.length) * 100) : 0;

  return {
    trends,
    categories,
    stats: {
      volume: { 
        current: currentVolume, 
        previous: 0,
        unit: 'Tests' 
      },
      efficiency: { 
        current: efficiency, 
        previous: 0, 
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
  const { tests } = useAppData();
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

  // New filters state
  const [filterDate, setFilterDate] = React.useState('');
  const [filterMonth, setFilterMonth] = React.useState('');

  const filteredTests = React.useMemo(() => {
    return tests.filter(test => {
      const matchesDate = !filterDate || test.date === filterDate;
      const matchesMonth = !filterMonth || test.date.startsWith(filterMonth);
      return matchesDate && matchesMonth;
    });
  }, [tests, filterDate, filterMonth]);

  const data = React.useMemo(() => 
    generateDynamicData(selection.category, selection.count, filteredTests),
    [selection.category, selection.count, filteredTests]
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
    const change = previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / previous) * 100;
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

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7);

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
              <Calendar size={18} /> Show Data
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
        </div>
      </div>

      <div className="filter-card glass-panel">
        <div className="filter-group">
          <label>Filter by Date</label>
          <input 
            type="date" 
            value={filterDate}
            max={todayStr}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Filter by Month</label>
          <input 
            type="month" 
            value={filterMonth}
            max={currentMonthStr}
            onChange={(e) => setFilterMonth(e.target.value)}
          />
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
                  {stat.current}{stat.unit}
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
      </div>
    </div>
  );
};

export default Analytics;
