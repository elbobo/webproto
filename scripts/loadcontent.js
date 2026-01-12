// Load and display projects based on URL parameter
(function() {
  // Get the category name from URL (everything after the ?)
  const queryString = window.location.search.substring(1);
  const categorySlug = queryString;
  
  if (!categorySlug) {
    console.error('No work category specified in URL');
    return;
  }
  
  // Load the JSON data
  fetch('content/content.json')
    .then(response => response.json())
    .then(data => {
      const category = data.categories[categorySlug];
      
      if (!category) {
        console.error(`Category "${categorySlug}" not found`);
        return;
      }
      
      // Update page title with category name
      const pageHead = document.querySelector('.pagehead .pagetitle');
      if (pageHead) {
        pageHead.textContent += category.name;
      }
      
      // Get the content grid container
      const contentGrid = document.querySelector('.content-grid .centred');
      if (!contentGrid) {
        console.error('Content grid container not found');
        return;
      }
      
      // Loop through projects and create HTML for each
      category.projects.forEach(project => {
        const projectElement = createProjectElement(project);
        contentGrid.appendChild(projectElement);
      });
    })
    .catch(error => {
      console.error('Error loading project data:', error);
    });

    if (window.location.hash) {
      setTimeout(() => {
        const element = document.querySelector(window.location.hash);
        if (element) {
          element.scrollIntoView();
        }
      }, 100); // Small delay to ensure DOM is ready
    }
  
  // Function to create a project element
  function createProjectElement(project) {
    const div = document.createElement('div');
    div.className = 'content-slice project';
    div.id = slugify(project.title); // Add this line
    
    // Build the meta section
    let metaHTML = '';

    project.meta.forEach(item => {
    if (item.url) {
        // It's a link
        metaHTML += `
        <p><span class="key">${item.key}</span><span class="val"><a href="${item.url}">${item.value}</a></span></p>
        `;
    } else {
        // It's a regular field
        metaHTML += `
        <p><span class="key">${item.key}</span><span class="val">${item.value}</span></p>
        `;
    }
    });
    
    // Build media HTML - loop through all media items
    let mediaHTML = '';

    project.media.forEach(mediaItem => {
    if (typeof mediaItem === 'string') {
        // Simple image or video path
        const extension = mediaItem.split('.').pop().toLowerCase();
        if (['mp4', 'webm', 'ogg'].includes(extension)) {
        mediaHTML += `
            <video controls>
            <source src="${mediaItem}" type="video/${extension}">
            Your browser does not support the video tag.
            </video>
        `;
        } else {
        mediaHTML += `<img src="${mediaItem}">`;
        }
    } else if (typeof mediaItem === 'object' && mediaItem.video) {
        // Video with poster
        const extension = mediaItem.video.split('.').pop().toLowerCase();
        mediaHTML += `
        <video controls poster="${mediaItem.poster}">
            <source src="${mediaItem.video}" type="video/${extension}">
            Your browser does not support the video tag.
        </video>
        `;
    }
    });

    // Handle description - either string or array
    let descriptionHTML = '';

    if (Array.isArray(project.description)) {
    // Description is an array of paragraphs
    descriptionHTML += project.description
        .map(p => `<p class="body">${p.trim()}</p>`)
        .join('\n                ');
    } else {
    // Description is a string - split on double line breaks
    descriptionHTML += project.description
        .split('\n\n')
        .filter(p => p.trim() !== '')
        .map(p => `<p class="body">${p.trim()}</p>`)
        .join('\n                ');
    }

    // Handle latest section if it exists
    let latestHTML = '';
    if (project.latest && project.latest.length > 0) {

      latestHTML = '<p class="body">Latest</p>\n';
    
    if (Array.isArray(project.latest)) {
        latestHTML += project.latest
        .map(p => `<p>${p.trim()}</p>`)
        .join('\n                ');
    } else {
        latestHTML += `<p class="body">${project.latest.trim()}</p>`;
    }
    }

    // Build the complete HTML
    div.innerHTML = `
    <div class="col project-intro">
        <div class="title">
        <p class="lead">${project.title}</p>
        <p class="body">${project.intro}</p>
        </div>
        <div class="meta">
        ${metaHTML}
        </div>
    </div>
    <div class="col project-media">
        ${mediaHTML}
    </div>
    <div class="col project-text">
        ${descriptionHTML}
    </div>
    ${latestHTML ? `<div class="col project-latest">\n      ${latestHTML}\n    </div>` : ''}
    `;
    
    return div;
  }
})();

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start
    .replace(/-+$/, '');         // Trim - from end
}