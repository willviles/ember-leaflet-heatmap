module.exports = {
  afterInstall: function() {
    return this.addBowerPackageToProject("heatmap.js-amd", "*");
  }
  
};
