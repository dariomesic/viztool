import { defineStore } from 'pinia'
export const useAuthUserStore = defineStore('authUser', {
    state: () => {
      return { 
        isLoggedIn: false,
        role: '',
        admin_viewer: true,
        user: '',
        report_name: '',
        report_path: '',
        report_id: '',
        report_content: [],
        viewer_timer: '',
        line: '',
        newBucketItem: false,
      }
    },
    actions: {
      login(loginData) {
        this.set_loggedIn(true);
        this.set_role(loginData.role);
        this.set_user(loginData.user);
        this.set_editMode(loginData.editMode);
      },
      logout() {
        this.set_loggedIn(false);
        this.set_user('');
        this.set_reportId('');
        this.set_reportName('');
        this.set_reportContent([]);
        this.set_reportPath('');
        this.set_reportTimer('');
      },
      set_loggedIn (value) {
        this.isLoggedIn = value
      },
      set_role (value) {
        this.role = value
      },
      set_editMode (value) {
        this.admin_viewer = value
      },
      set_user (value) {
        this.user = value
      },
      set_reportName (value){
        this.report_name = value
      },
      set_reportPath (value){
        this.report_path = value
      },
      set_reportId (value){
        this.report_id = value
      },
      set_reportContent (value){
        this.report_content = value
      },
      set_reportTimer(value){
        this.viewer_timer = value
      },
      set_sqlLine(value){
        this.line = value
      },
      set_newBucketItem(value){
        this.newBucketItem = value
      }
    },
})