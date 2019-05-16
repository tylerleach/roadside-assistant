# roadside-assistant

## Todo List: Tyler

- [x] ~~Setup backend for professional bank details.~~
- [x] ~~Test whether general user update method in backend works for all user types~~
- [x] ~~Setup back-end for members creating a request~~
- [x] ~~Create front-end page for members to create a request~~
- [x] ~~Connect back-end and front-end for request creation~~
- [x] ~~Make the accepted responders persistent (Incase the member reloads the page).~~
- [x] ~~Update the accepted responders for a request in realtime (so the member doesn't have to refresh the page).~~
- [x] ~~Display accepted professionals for a request to the request creater.~~
- [x] ~~Also display the professionals past reviews to the request creater.~~
- [ ] Generalize a method in RequestsPage.vue for the onOk modal method as they both share common attributes.
- [ ] Add get credit card details function to the back-end.
- [ ] Add get bank account details function to the back-end.
- [ ] Add confirm modal for deleting a user on the admin page. 
- [x] ~~Create a page for the map with directions to be displayed on.~~
- [x] ~~Have map page load directions on page load.~~
- [x] Change the request model in the database, change the completed field to status with type enum ('available', 'in-progress', 'completed')
- [ ] Add a request completion button to the map page for professionals to confirm when a service request has been completed.

## Todo List: Arpan

- [ ] Add a sidebar to the UpdateUserDetailsPage.vue (look at the MakeRequestPage.vue for an example, basically like the RequestSidebar.vue but for updating account details)

- [ ] Set the initial page as the UpdateUserPage.vue (for the sidebar mentioned above)

- [ ] Add a menu item for add/update bank account details page for the sidebar mentioned above (should only be visible to professionals)

- [ ] Add a menu item for add/update credit card details page for the sidebar mentioned above (should only be visible to members)

- [x] Add add/update bank account details page to the front-end for professionals.

- [x] Add add/update credit card details page to the front-end for members.
