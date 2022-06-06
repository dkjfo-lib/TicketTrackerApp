const moment = require("moment");

module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format);
  },

  truncate: function (text, length) {
    if (text.length > length) {
      let newText = text + " ";
      newText = text.substr(0, length);
      return newText + "...";
    }
    return text;
  },

  stripTags: function (text) {
    return text.replace(/<(?:.|\n)*?>/gm, "");
  },

  editIcon: function (ticketAuthor, loggedUser, ticketId, floating = true) {
    if (ticketAuthor._id.toString() === loggedUser.id.toString()) {
      if (floating) {
        return `<a href="/tickets/edit/${ticketId}" 
            class = "btn-floating halfway-fab green">
                <i class="fas fa-edit fa-small"></i>
            </a>`;
      } else {
        return `<a href="/tickets/edit/${ticketId}">
                <i class="fas fa-edit"></i>
            </a>`;
      }
    }else{
        return ''
    }
  },

  select: function(selected, options){
    return options
    .fn(this)
    .replace(
      new RegExp(' value="' + selected + '"'),
      '$& selected="selected"'
    )
    .replace(
      new RegExp('>' + selected + '</option>'),
      ' selected="selected"$&'
    )
  }
};
