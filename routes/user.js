
//---------------------------------------------signup page call------------------------------------------------------
exports.Register = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.Name;
      var email = post.email_id;
      var pass= post.password;
      var sem=post.Semester_course;

      if (!req.files)
      return res.status(400).send('No files were uploaded.');

var file = req.files.uploaded_image;
var img_name=file.name;

   if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                           
        file.mv('public/images/upload_images/'+file.name, function(err) {
                       
           if (err)

             return res.status(500).send(err);


      var sql = "INSERT INTO `login`(`Name`,`email_id`,`image`, `password`,`Semester_course`) VALUES ('" + name + "','" + email + "','" + img_name + "','" + pass + "','" + sem + "')";

      var query = db.query(sql, function(err, result) {

         message = "Succesfully! Your account has been created.";
         res.render('index.ejs',{message: message});
      });
   });

} else {
   message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
   res.render('index.ejs',{message: message});
 }
}
else {
   res.render('index');
}

};
 
//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var email= post.email_id;
      var pass= post.password;
     
      var sql="SELECT id, Name, email_id, image,Semester_course FROM `login` WHERE `email_id`='"+email+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){      
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/home/dashboard');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('login.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('login.ejs',{message: message});
   }
           
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
           
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   console.log('ddd='+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT login.id,login.Name,login.image,login.email_id,login.password,login.Semester_course,post.post_id,post.Question,post.keyword,post.attachment,post.Body,post.login_id FROM `login` join `post` on (login.id=post.login_id) WHERE `id`='"+userId+"'";
   db.query(sql, function(err,data){
      res.render('dashboard.ejs', {user:user,userData:data});    
   });       
};

//-----------------------------------------------Staff dashboard page functionality----------------------------------------------
           
exports.staff_dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   console.log('ddd='+userId);
   if(userId == null){
      res.redirect("/tlogin");
      return;
   }

   var sql="SELECT * FROM `login` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('staff_dashboard.ejs', {user:user});    
   });       
};

//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res){
   var message = '';
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `login` WHERE `id`='"+userId+"'"; 
   db.query(sql, function(err, result){  
      res.render('profile.ejs',{data:result,message:message});
   });
};

//---------------------------------create a post------------------------------------------


 exports.display = function(req, res){  
   var userId = req.session.userId;
   var post_id = req.params.post_id;
              db.query(`SELECT post.post_id,post.Question,post.keyword,post.Body,post.attachment, replies.reply_id,replies.body,replies.post_id,replies.replied_by FROM post INNER JOIN replies ON (post.post_id=replies.post_id) where replies.post_id = ?`,[post_id],function(err,data)
         {           
            if(err) throw err;
            res.render('display',{page_title:"Edit Customers - Node.js",userData:data});
            });              
      }
            

 exports.comment = (req,res,next) =>{
   var userId = req.session.userId;
   var body      = req.body.body;
   var post_id = req.params.post_id;
   
  var sql = `INSERT INTO replies (body,post_id,replied_by ) VALUES ('${body}','${post_id}','${userId}' )`;
  db.query(sql,function (err, data) {
     if (err) throw err;
          console.log("record inserted");
          res.redirect('/home/posts');
      });
  
 }


 //---------------------------------------------signup page call------------------------------------------------------
exports.create = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var userId = req.session.userId;
      var Question= post.Question;
      var keyword = post.keyword;
      var Body= post.Body;

      if (!req.files)
      return res.status(400).send('No files were uploaded.');

var file = req.files.uploaded_attachment;
var img_name=file.name;

   if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                           
        file.mv('public/images/upload_images/'+file.name, function(err) {
                       
           if (err)

             return res.status(500).send(err);


      var sql = "INSERT INTO `post`(`Question`,`keyword`,`attachment`, `Body`,`login_id`) VALUES ('" + Question + "','" + keyword + "','" + img_name + "','" + Body + "','" + userId + "')";

      db.query(sql, function(err, data) {

         message = "Succesfully! Your Question has been posted.";
         res.redirect('/home/posts')
      });
   });

} else {
   message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
   res.render('posts.ejs',{message: message});
 }
}
else {
   res.render('posts');
}

};

exports.posts = function(req, res){
   var userId = req.session.userId;
   var sql=`SELECT post.post_id, post.Question,post.login_id,login.Name,login.image,login.id FROM post INNER JOIN login ON (post.login_id=login.id) order by post_id`;
   db.query(sql, function (err, data) {
  if (err) throw err;
  res.render('posts', { title: 'display', userData: data });
 });
 };

 
 exports.replies = function(req, res){  

   var post_id = req.params.post_id;
        
      db.query(`SELECT post.post_id,post.Question,post.keyword,post.Body,post.attachment, replies.body,replies.post_id FROM post INNER JOIN replies ON (post.post_id=replies.post_id) where replies.post_id = ?`,[post_id],function(err,data)
         {           
            if(err) throw err;
            res.render('display',{page_title:"Edit Customers - Node.js",userData:data});
            });              
      }

//-----------------------------------------------Teacher login page call------------------------------------------------------
exports.tlogin = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var email= post.email_id;
      var pass= post.password;
     
      var sql="SELECT id, Name, email_id, image FROM `login` WHERE `email_id`='"+email+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){      
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/home/staff_dashboard');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('tlogin.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('tlogin.ejs',{message: message});
   }
           
};


exports.create_forum = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var userId = req.session.userId;
      var fname= post.forum_name;
      var dept = post.semester_course


      var sql = "INSERT INTO `forum`(`forum_name`,`created_by`,`semester_course`) VALUES ('" + fname + "','" + userId + "','" + dept + "')";
      var query = db.query(sql, function(err, result) {

         message = "Succesfully! Your Question has been posted.";
         res.render('staff_dashboard.ejs',{message: message});
      });
    }
  else {
   res.render('staff_dashboard.ejs',{message: message});
 }
}

exports.teacher_forum = function(req, res){
   var message = '';
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/home/staff_dashboard");
      return;
   }
   var sql="SELECT * FROM `forum` WHERE `created_by`='"+userId+"'"; 
   db.query(sql, function(err, data){  
      res.render('teacher_forum.ejs',{userData:data,message:message});
   });
};

exports.delete_post = function(req,res){
          
   var id = req.params.post_id;
      
      db.query("DELETE FROM post  WHERE post_id = ? ",[id], function(err, rows)
      {
          
           if(err)
               console.log("Error deleting : %s ",err );
          
           res.redirect('/home/posts');
           
      });
      
   }

   exports.edit = function(req, res){
    
      var id = req.params.post_id;
         
          db.query('SELECT * FROM post WHERE post_id = ?',[id],function(err,rows)
          {
              
              if(err)
                  console.log("Error Selecting : %s ",err );
       
                res.render('editpost',{page_title:"Edit Customers - Node.js",data:rows});
                  
             
           });
           
           //console.log(query.sql); 
  };

  exports.save_edit = function(req,res){
    
   var input = JSON.parse(JSON.stringify(req.body));
   var id = req.params.post_id;     
 var data = {
           
           Question    : input.Question,
           keyword : input.keyword,
           Body   : input.Body     
       };
       
       db.query("UPDATE post set ? WHERE post_id = ? ",[data,id], function(err, rows)
       {
 
         if (err)
             console.log("Error Updating : %s ",err );
        
         res.redirect('/home/posts');
         
       });
};

exports.view_forum = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   console.log('ddd='+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT login.id,login.Semester_course,forum.semester_course,forum.forum_name FROM `login` join `forum` on (login.Semester_course=forum.semester_course) WHERE `id`='"+userId+"'";
   db.query(sql, function(err,data){
      res.render('dashboard.ejs', {user:user,userData:data});    
   });       
};