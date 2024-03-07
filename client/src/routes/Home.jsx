import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage, setAnnouncementsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Example API endpoint for all announcements
  const apiEndpoint = 'http://localhost:3005/getAnnouncements';

  // For navigation
  const navigate = useNavigate();

  // Fetch announcements from API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${apiEndpoint}?rows_per_page=${announcementsPerPage}&page_number=${currentPage}`);
        const jsonData = await response.json();
        const response1 = await fetch(`http://localhost:3005/getTotalAnnouncements`);
        const jsonData1 = await response1.json();
        console.log(jsonData1.data);
        const totalAnnouncementsCount = Number(jsonData1.data.cnt.count); // Convert count to a number
        console.log('Total Announcements Count:', totalAnnouncementsCount);

        setAnnouncements(jsonData.data.announcements.map(announcement => ({ ...announcement, expanded: false })));
        setTotalPages(Math.ceil(totalAnnouncementsCount / announcementsPerPage));

        // Log the values after state updates
        console.log('Announcements:', totalAnnouncementsCount, announcementsPerPage, totalPages);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchAnnouncements();
  }, [currentPage, announcementsPerPage]);

  // Handle pagination button click
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    setAnnouncementsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when changing rows per page
  };

  // For viewing announcement details
  const viewAnnouncement = (id) => {
    navigate(`/announcement/${id}`);
  };

  // Function to toggle the description display state
  const toggleDescription = (index) => {
    const updatedAnnouncements = [...announcements];
    updatedAnnouncements[index].expanded = !updatedAnnouncements[index].expanded;
    setAnnouncements(updatedAnnouncements);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div>
        {/* Header */}
        <div>
          <h1 style={{ fontWeight: 'light', fontSize: '2.5rem', textAlign: 'center', marginTop: '1.5rem' }}>Announcements</h1>
        </div>

        {/* Rows per page dropdown */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <label htmlFor="rowsPerPage" style={{ marginRight: '0.5rem' }}>Rows per page:</label>
          <select id="rowsPerPage" value={announcementsPerPage} onChange={handleRowsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>

        {/* Announcements */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {announcements.map((announcement, index) => (
            <div
              key={announcement.announcement_id}
              style={{
                width: '1000px',
                margin: '1rem',
                padding: '1rem',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column', // Align the button vertically
              }}
            >
              <div style={{ flexGrow: 1 }}> {/* Added to allow the title to grow and push the buttons to the bottom */}
                <h3 style={{ marginBottom: '0.5rem' }}>{announcement.storefront_name}</h3>
                <p style={{ marginBottom: '0.5rem' }}>
                  {announcement.expanded ? announcement.announcement_description : announcement.announcement_description.substring(0, 10)}
                </p>
                {announcement.expanded && announcement.image && (
                  <img
                    src={require(`../images/${announcement.image}`)}
                    alt="Announcement Image"
                    style={{ width: '30%', height: 'auto' }}
                  />
                )}
              </div>
              {(announcement.announcement_description.length > 10 || announcement.image) && (
                <div style={{ alignSelf: 'flex-end' }}>
                  <button onClick={() => toggleDescription(index)}>
                    {announcement.expanded ? 'Show less' : 'Show more'}
                  </button>
                </div>
              )}
              <hr style={{ backgroundColor: 'gray', height: '1px', border: 'none', margin: '0.5rem 0' }} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            style={{ padding: '0.5rem', marginRight: '1rem', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white' }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span style={{ fontSize: '1rem', marginRight: '1rem' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            style={{ padding: '0.5rem', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white' }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
