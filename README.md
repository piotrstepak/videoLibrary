
# Assignment: Video library

### In the project directory, you can run:
### `node server.js`
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Story

There is apprehension that Youtube servers will be unavailable since It’s hard to predict the nearest future. Your company has been engaged to provide internal service so Youtube data can be stored as a backup.

## Requirements

Important: For the sake of simplicity focus on the backend side - your primary job is to prepare suitable API. The requirements assume an existing page but for now it is not obligatory - you can test your API with Postman.


![Requirements](docs/requirements.png)

![Requirements](docs/requirements_update.png)


For the sake of make this assignment easier to understand, each User Story represents an API endpoint in the web application:

## Get random videos [ GET /api/videos?random=true ]

    • It should return a list of 5 random videos.


## Add new video [ POST /api/videos ]

    • Request validationrules:
        ◦ Videourl:
            ▪ single linetext
            ▪ required
            ▪ has to fit urlsyntax
        ◦ Videotitle:
            ▪ single linetext
            ▪ required
            ▪ minimum length: 3characters
        ◦ Videodescription:
            ▪ multi-linetext
            ▪ required
        ◦ Tags:
            ▪ single line text input with value(s) starting with #, separated by whitelines
            ▪ optional
        ◦ Uploadedby:
            ▪ single line numberinput
            ▪ minimum length: 3characters
            ▪ optional
        ◦ Contactemail:
            ▪ single lineinput

            ▪ has to fit emailsyntax
            ▪ optional
    • When the user clicks the "Add new Video" (sends POST request) button, the form should submit it'sdata
    • Id for new video isauto-generated
    • ... and the server should add these data to the csvstorage.


## Update existing Video [ PUT /video/{{video_id}} ]

    • The same form as the add page, but filled in with data of the givenVideo.
    • This data should be read from the csvfile.
    • An additional checkbox with “archive”label
    • Archived videos should not be visible whenever I’m retrievingdata
    
