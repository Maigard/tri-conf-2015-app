import Ember from 'ember';
import inject from 'ember-cli-injection/inject';

var injectSession = inject('session');

export default Ember.Component.extend({
  session: injectSession('main'),
  challenge: null,
  isEditing: false,
  isNew: function() {
    this.set('isEditing', this.get('challenge.isNew'));
  }.observes('challenge').on('init'),

  achieved: false,
  achievedUpdated: function() {
    if(this.get('session.isAuthenticated')) {
      var didAchieve = false;
      var that = this;
      this.get('session.user.achieved').then(function(achievedChallenges){
        achievedChallenges.forEach(function(challenge){
          if(challenge === that.get('challenge')) {
            didAchieve = true;
          }
        });
        that.set('achieved', didAchieve);
      });
    }
  }.observes('challenge', 'session.user.achieved').on('init'),

  actions: {
    editChallenge: function(){
      this.set('isEditing', true);
      this.sendAction('onEdit', this.get('challenge'));
    },
    removeChallenge: function(){
      this.sendAction('onRemove', this.get('challenge'));
    },
    saveChallenge: function() {
      this.set('isEditing', false);
      this.sendAction('onSave', this.get('challenge'));
    },
    cancelChange: function() {
      this.set('isEditing', false);
      this.sendAction('onCancel', this.get('challenge'));
    },
    checkIn: function() {
      this.sendAction('checkIn', this.get('challenge'));
    }
  }
});
