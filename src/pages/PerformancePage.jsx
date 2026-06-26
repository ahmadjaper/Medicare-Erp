import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import TopNavbar from '../components/TopNavbar';
import { getDoctorInfo, getKPIMetrics, getTopServices, getFeedbackSummary, getAppointmentsTrend, getRevenueTrend } from '../services/api';
import { doctors } from '../data/doctorsData';
import doctorAvatar from '../assets/img/doctor-avatar.png';
import '../assets/css/performance.css';

function PerformancePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the doctor from doctorsData.js.
  // Do not fallback to doctors[0] if id is not found or not provided.
  const doctor = id ? doctors.find(doc => doc.id === id) : null;

  // 1. Local States
  const [timeRange, setTimeRange] = useState("This Month");
  const [metrics, setMetrics] = useState(null);
  const [services, setServices] = useState([]);
  const [feedback, setFeedback] = useState(null);

  // Chart canvas refs
  const appointmentsCanvasRef = useRef(null);
  const revenueCanvasRef = useRef(null);
  
  // Chart instances refs (persisted across renders)
  const appointmentsChartRef = useRef(null);
  const revenueChartRef = useRef(null);

  // 2. Fetch Data Lifecycle
  useEffect(() => {
    async function loadInitialData() {
      if (!doctor) return;

      const servicesData = await getTopServices();
      setServices(servicesData);

      const feedbackData = await getFeedbackSummary();
      setFeedback(feedbackData);
    }
    loadInitialData();
  }, [doctor]);

  // Fetch metrics when timeRange changes
  useEffect(() => {
    async function loadMetrics() {
      if (!doctor) return;
      const metricsData = await getKPIMetrics(timeRange);
      setMetrics(metricsData);
    }
    loadMetrics();
  }, [timeRange, doctor]);

  // Render/Re-render charts when components mount or data changes
  useEffect(() => {
    async function renderCharts() {
      if (!doctor) return;
      const appTrendData = await getAppointmentsTrend();
      const revTrendData = await getRevenueTrend();

      // Chart 1: Appointments Trend
      if (appointmentsCanvasRef.current) {
        if (appointmentsChartRef.current) {
          appointmentsChartRef.current.destroy();
        }
        const ctx = appointmentsCanvasRef.current.getContext('2d');
        appointmentsChartRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: appTrendData.labels,
            datasets: [
              {
                label: 'Completed',
                data: appTrendData.datasets.completed,
                borderColor: '#0963e2',
                backgroundColor: '#0963e2',
                borderWidth: 3,
                tension: 0.35,
                pointRadius: 5,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#0963e2',
                pointBorderWidth: 2,
                pointHoverRadius: 7,
                fill: false
              },
              {
                label: 'Cancelled',
                data: appTrendData.datasets.cancelled,
                borderColor: '#dc2626',
                backgroundColor: '#dc2626',
                borderWidth: 2.5,
                borderDash: [6, 4],
                tension: 0.35,
                pointRadius: 0,
                fill: false
              },
              {
                label: 'No Show',
                data: appTrendData.datasets.noShow,
                borderColor: '#eab308',
                backgroundColor: '#eab308',
                borderWidth: 2.5,
                borderDash: [6, 4],
                tension: 0.35,
                pointRadius: 0,
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                padding: 10,
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: { family: 'Inter', size: 12, weight: 'bold' },
                bodyFont: { family: 'Inter', size: 12 },
                cornerRadius: 6
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { family: 'Inter', size: 11, weight: '500' }, color: '#64748b' }
              },
              y: {
                min: 0,
                max: 150,
                ticks: {
                  stepSize: 50,
                  font: { family: 'Inter', size: 11, weight: '500' },
                  color: '#64748b'
                },
                border: { dash: [5, 5] },
                grid: { color: '#e2e8f0' }
              }
            }
          }
        });
      }

      // Chart 2: Revenue Trend
      if (revenueCanvasRef.current) {
        if (revenueChartRef.current) {
          revenueChartRef.current.destroy();
        }
        const ctx = revenueCanvasRef.current.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 260);
        gradient.addColorStop(0, 'rgba(9, 99, 226, 0.16)');
        gradient.addColorStop(1, 'rgba(9, 99, 226, 0.0)');

        revenueChartRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: revTrendData.labels,
            datasets: [{
              label: 'Revenue',
              data: revTrendData.revenue,
              borderColor: '#0963e2',
              backgroundColor: gradient,
              borderWidth: 3,
              tension: 0.35,
              pointRadius: 5,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#0963e2',
              pointBorderWidth: 2,
              pointHoverRadius: 7,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                padding: 10,
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: { family: 'Inter', size: 12, weight: 'bold' },
                bodyFont: { family: 'Inter', size: 12 },
                cornerRadius: 6,
                callbacks: {
                  label: function(context) {
                    return ` Revenue: $${context.raw.toLocaleString()}`;
                  }
                }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { family: 'Inter', size: 11, weight: '500' }, color: '#64748b' }
              },
              y: {
                min: 10000,
                max: 40000,
                ticks: {
                  stepSize: 10000,
                  callback: function(value) { return "$" + (value / 1000) + "k"; },
                  font: { family: 'Inter', size: 11, weight: '500' },
                  color: '#64748b'
                },
                border: { dash: [5, 5] },
                grid: { color: '#e2e8f0' }
              }
            }
          }
        });
      }
    }
    renderCharts();

    // Clean up instances on unmount
    return () => {
      if (appointmentsChartRef.current) appointmentsChartRef.current.destroy();
      if (revenueChartRef.current) revenueChartRef.current.destroy();
    };
  }, [doctor]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  const getTrendBadge = (trendData) => {
    if (!trendData) return null;
    const isUp = trendData.trend === "up";
    return (
      <span className={`kpi-trend ${isUp ? 'trend-up' : 'trend-down'}`}>
        <i className={isUp ? "bi bi-arrow-up-short" : "bi bi-arrow-down-short"}></i>
        {trendData.change}
        <span className="text-muted fw-normal ms-1">{trendData.label}</span>
      </span>
    );
  };

  const handleBack = () => {
    if (doctor && doctor.id) {
      navigate(`/doctors/details/${doctor.id}`);
    } else {
      navigate('/doctors');
    }
  };

  if (!doctor) {
    return (
      <>
        {/* Top Navbar & Page Header breadcrumb flex row */}
        <div className="top-navbar">
          <div>
            <h1 className="page-title">Doctor Not Found</h1>
            <nav className="breadcrumb-custom" aria-label="breadcrumb">
              <span className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate('/doctors')}>Doctors</span>
              <span className="mx-2">&gt;</span>
              <span className="active">Not Found</span>
            </nav>
          </div>
          <TopNavbar />
        </div>

        <div className="card p-5 text-center mt-4 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div className="mb-4">
            <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3.5rem' }}></i>
          </div>
          <h3 className="mb-2" style={{ fontWeight: 700, color: 'var(--text-main)' }}>Doctor Profile Not Found</h3>
          <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
            The doctor with ID <strong className="text-dark">{id || 'unknown'}</strong> could not be found in our records.
          </p>
          <div>
            <button className="btn btn-primary px-4 py-2" onClick={() => navigate('/doctors')} style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              <i className="bi bi-arrow-left me-2"></i> Return to Doctors List
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Top Navbar & Page Header breadcrumb flex row */}
      <div className="top-navbar">
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-link p-0 text-dark" 
            onClick={handleBack}
            title="Back to Doctor Details"
            style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <i className="bi bi-arrow-left fs-3"></i>
          </button>
          <div>
            <h1 className="page-title mb-0">Doctor Performance</h1>
            <nav className="breadcrumb-custom" aria-label="breadcrumb">
              <span className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate('/doctors')}>Doctors</span>
              <span className="mx-2">&gt;</span>
              <span className="text-muted" style={{ cursor: 'pointer' }} onClick={handleBack}>{doctor.name}</span>
              <span className="mx-2">&gt;</span>
              <span className="active">Performance</span>
            </nav>
          </div>
        </div>
        <TopNavbar />
      </div>

      {/* Doctor Summary Header Card */}
      <div className="card doctor-card p-4 mb-4">
        <div className="doctor-card-content d-flex align-items-center gap-3">
          <img 
            src={doctor.avatar || doctorAvatar} 
            id="doctor-avatar" 
            className="doctor-profile-img" 
            alt={doctor.name} 
            onError={(e) => {
              e.target.src = doctorAvatar;
            }}
          />
          <div>
            <div className="d-flex align-items-center gap-2">
              <h2 className="doctor-name mb-0">{doctor.name}</h2>
              <span className="badge-active">{doctor.status}</span>
            </div>
            <div className="doctor-specialty">{doctor.specialty}</div>
            <div className="doctor-id">{doctor.id}</div>
          </div>
        </div>
      </div>

      {/* Toolbar filters */}
      <div className="toolbar-section">
        <div className="dropdown">
          <button className="filter-dropdown-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="bi bi-calendar3"></i> {timeRange}
          </button>
          <ul className="dropdown-menu border-0 shadow-sm" style={{ borderRadius: '8px' }}>
            {["This Month", "Last Month", "This Quarter", "This Year"].map((range, idx) => (
              <li key={idx}>
                <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setTimeRange(range); }}>
                  {range}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <button className="btn-medicore" onClick={() => useErpStore.getState().showToast("Exporting metrics report...", "success")}>
          <i className="bi bi-box-arrow-up-right"></i> Export Report
        </button>
      </div>

      {/* KPI Cards Row */}
      {metrics && (
        <div className="kpi-row">
          {/* KPI 1 */}
          <div className="card dashboard-card kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-title">Total<br />Appointments</div>
              <div className="kpi-icon-wrapper kpi-icon-blue"><i className="bi bi-calendar-event"></i></div>
            </div>
            <div className="kpi-value">{metrics.totalAppointments.value}</div>
            <div className="kpi-footer">
              {getTrendBadge(metrics.totalAppointments)}
            </div>
          </div>

          {/* KPI 2 */}
          <div className="card dashboard-card kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-title">Completed</div>
              <div className="kpi-icon-wrapper kpi-icon-green"><i className="bi bi-check-circle"></i></div>
            </div>
            <div className="kpi-value">{`${metrics.completedAppointments.value} / ${metrics.completedAppointments.total}`}</div>
            <div className="service-progress-bar w-100 mb-2">
              <div className="service-progress-fill bg-success" style={{ width: `${metrics.completedAppointments.percentage}%` }}></div>
            </div>
            <div className="kpi-footer">
              <span className="fw-bold text-success">{metrics.completedAppointments.percentage.toFixed(1)}%</span>
              <span className="ms-1">completion rate</span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="card dashboard-card kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-title">Revenue</div>
              <div className="kpi-icon-wrapper kpi-icon-orange"><i className="bi bi-credit-card"></i></div>
            </div>
            <div className="kpi-value">{formatCurrency(metrics.revenue.value)}</div>
            <div className="kpi-footer">
              {getTrendBadge(metrics.revenue)}
            </div>
          </div>

          {/* KPI 4 */}
          <div className="card dashboard-card kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-title">Patient Rating</div>
              <div className="kpi-icon-wrapper kpi-icon-yellow"><i className="bi bi-star"></i></div>
            </div>
            <div className="kpi-value">{`${metrics.rating.value} / ${metrics.rating.max}`}</div>
            <div className="d-flex text-warning gap-1 mb-1" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
            </div>
            <div className="kpi-footer">Average patient score</div>
          </div>

          {/* KPI 5 */}
          <div className="card dashboard-card kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-title">No Show Rate</div>
              <div className="kpi-icon-wrapper kpi-icon-red"><i className="bi bi-calendar-x"></i></div>
            </div>
            <div className="kpi-value">{metrics.noShowRate.value}</div>
            <div className="kpi-footer">
              {getTrendBadge(metrics.noShowRate)}
            </div>
          </div>
        </div>
      )}

      {/* Chart Layout */}
      <div className="charts-row">
        <div className="card dashboard-card chart-card">
          <div className="chart-card-header">
            <h3 className="chart-title">Appointments Trend</h3>
            <div className="d-flex align-items-center gap-3" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              <div className="d-flex align-items-center gap-1">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0963e2', display: 'inline-block' }}></span>
                <span>Completed</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626', display: 'inline-block' }}></span>
                <span>Cancelled</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308', display: 'inline-block' }}></span>
                <span>No Show</span>
              </div>
            </div>
          </div>
          <div className="chart-canvas-wrapper">
            <canvas ref={appointmentsCanvasRef}></canvas>
          </div>
        </div>

        <div className="card dashboard-card chart-card">
          <div className="chart-card-header">
            <h3 className="chart-title">Revenue Trend</h3>
          </div>
          <div className="chart-canvas-wrapper">
            <canvas ref={revenueCanvasRef}></canvas>
          </div>
        </div>
      </div>

      {/* Bottom Service & Ratings Row */}
      <div className="bottom-row">
        <div className="card dashboard-card bottom-card">
          <h3 className="bottom-card-title">Top Services by Revenue</h3>
          <div id="top-services-container">
            {services.map((srv, idx) => (
              <div key={idx} className="service-item">
                <div className="service-meta">
                  <span>{srv.name}</span>
                  <span>{formatCurrency(srv.amount)} <span className="service-pct">({srv.percentage}%)</span></span>
                </div>
                <div className="service-progress-bar">
                  <div className="service-progress-fill" style={{ width: `${srv.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card dashboard-card bottom-card">
          <h3 className="bottom-card-title">Patient Feedback</h3>
          {feedback && (
            <>
              <div className="feedback-summary-container">
                <div className="feedback-avg-score">{feedback.average.toFixed(1)}</div>
                <div className="rating-stars">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <div className="feedback-count-text">{`Based on ${feedback.totalReviews} reviews`}</div>
              </div>

              <div id="rating-dist-container">
                {feedback.distribution.map((dist, idx) => {
                  let colorClass = "fill-green";
                  if (dist.stars === 4) colorClass = "fill-blue";
                  if (dist.stars === 3) colorClass = "fill-yellow";
                  if (dist.stars === 2 || dist.stars === 1) colorClass = "fill-red";
                  
                  return (
                    <div key={idx} className="rating-dist-row">
                      <span className="rating-dist-label">{dist.stars} Stars</span>
                      <div className="rating-dist-progress">
                        <div className={`rating-dist-fill ${colorClass}`} style={{ width: `${dist.percentage}%` }}></div>
                      </div>
                      <span className="rating-dist-count">{`${dist.count} (${dist.percentage}%)`}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default PerformancePage;
