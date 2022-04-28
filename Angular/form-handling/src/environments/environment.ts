// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'http://192.168.1.35:5000/api/',
  // socketUrl: 'http://192.168.1.35:5000/',
  // imageUrl: 'http://192.168.1.35:5000/uploads/',
  // postImageUrl: 'http://192.168.1.35:5000/posts/',

  apiUrl: 'https://media-2.herokuapp.com/api/',
  socketUrl: 'https://media-2.herokuapp.com/',
  imageUrl: 'https://media-2.herokuapp.com/uploads/',
  postImageUrl: 'https://media-2.herokuapp.com/posts/',

  navBarBackground: '#a2bdf0',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
