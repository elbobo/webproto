// Load and display category overviews
(function() {
  
  // Load the JSON data
  fetch('content/content.json')
    .then(response => response.json())
    .then(data => {
      // Get the dynamic content container
      const dynamicContainer = document.querySelector('.dynamic');
      if (!dynamicContainer) {
        console.error('Dynamic container not found');
        return;
      }
      
      // Loop through each category
      Object.keys(data.categories).forEach(categorySlug => {
        const category = data.categories[categorySlug];
        
        // Create a content slice for this category
        const sliceElement = createCategorySlice(categorySlug, category);
        dynamicContainer.appendChild(sliceElement);
      });
    })
    .catch(error => {
      console.error('Error loading project data:', error);
    });
  
  // Function to create a category slice
  function createCategorySlice(categorySlug, category) {
    const div = document.createElement('div');
    div.className = 'content-slice';
    
    // Get first two projects
    const project1 = category.projects[0];
    const project2 = category.projects[1] || null; // might not have a second project
    
    // Build HTML for first project
    const project1HTML = project1 ? `
      <div class="col">
        <a href="ourwork.html?${categorySlug}#${slugify(project1.title)}">
          <img src="${getMediaImage(project1.media)}">
          <p class="projecttitlehome">${project1.title}</p>
          <p>${project1.intro}</p>
        </a>
      </div>
    ` : '';
    
    // Build HTML for second project (if it exists)
    const project2HTML = project2 ? `
      <div class="col">
        <a href="ourwork.html?${categorySlug}#${slugify(project2.title)}">
          <img src="${getMediaImage(project2.media)}">
          <p class="projecttitlehome">${project2.title}</p>
          <p>${project2.intro}</p>
        </a>
      </div>
    ` : '<div class="col"></div>'; // empty col if no second project
    
    // Build the complete HTML
    div.innerHTML = `
      <div class="col hometitle">
        <p class="lead">Building better ${category.name}</p>
        <p>${category.description}</p>
      </div>
      ${project1HTML}
      ${project2HTML}
      <div class="col onward">
        <a href="ourwork.html?${categorySlug}"><span>View all <span> <span class="cat">${category.name}</span> <span>projects</span></a>
      </div>
    `;
    
    return div;
  }
  
  // Function to extract image from media (handle video poster or image)
  function getMediaImage(media) {
    // Media is an array
    if (Array.isArray(media) && media.length > 0) {
      const firstItem = media[0];
      
      // If it's an object with video property, use the poster
      if (typeof firstItem === 'object' && firstItem.video) {
        return firstItem.poster;
      }
      
      // If it's a string, use it directly
      if (typeof firstItem === 'string') {
        return firstItem;
      }
    }
    
    // Fallback to placeholder if no media found
    return 'content/images/placeholder.png';
  }
  
  // Helper function to create URL-friendly slugs
  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/[^\w\-]+/g, '')    // Remove non-word chars
      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start
      .replace(/-+$/, '');         // Trim - from end
  }
})();