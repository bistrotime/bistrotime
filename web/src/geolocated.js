export default (success) => {
  if ('geolocation' in navigator) {
    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(success, () => {}, options);
  }
};
