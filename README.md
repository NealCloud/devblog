# Dev Blog

> A blog for creating projects and learning from your mistakes

- [Live Demo](http://nealcloud.github.io/devblog) 

### Features
  - free account creation
  - create projects
  - create and edit posts on projects
  - read about your project and others
  - search for projects and posts inside
  - keeps track of your projects progress hours
  
### Lessons Learned
 - working with angular and firebase
 - creating user authentication and permissions
 - displaying content from firebase using queries
 - using angular ui routes to create multiple unique pages
 
##### ui routes to giving each project its own unique page id
```javascript
.state('project', {
                url: '/project/:projectID',
                views: {
                    // the main template is blank
                    '': { templateUrl: 'page/project.html',
                        controller: 'projectCtrl',
                        controllerAs: 'pc'
                    },
                    // the child views uses @ to seperate it from parent  html ex: ui-view="columnOne"
                    'deleteModal@project': {
                        templateUrl: 'page/projectModal.html',
                        controller: 'projectCtrl',
                        controllerAs: 'pc'
                    }
                }
            })
```

### Version
1.1

### Tech
* [ Javascript ]
* [ jQuery ]
* [ Angular ]
* [ firebase ]

### Todos
 - [ ] allow for front page editing/deleting
 - [ ] editing of a project's settings

### Bugs
- none documented yet

License
----
MIT

