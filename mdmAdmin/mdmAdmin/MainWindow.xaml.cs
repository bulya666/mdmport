using mdmAdmin.Data;
using mdmAdmin.Models;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Linq;

namespace mdmAdmin
{
    public partial class MainWindow : Window
    {
        private readonly AppDbContext _db = new();

        public MainWindow()
        {
            InitializeComponent();
            LoadUsers();
        }

        private void LoadUsers()
        {
            UserGrid.ItemsSource = _db.Users.ToList();
        }

        private void UserGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (UserGrid.SelectedItem is User u)
            {
                UsernameBox.Text = u.Username;
                PasswordBox.Text = u.Password;
            }
        }

        private void Add_Click(object sender, RoutedEventArgs e)
        {
            var u = new User
            {
                Username = UsernameBox.Text,
                Password = PasswordBox.Text
            };

            _db.Users.Add(u);
            _db.SaveChanges();
            LoadUsers();
        }

        private void Update_Click(object sender, RoutedEventArgs e)
        {
            if (UserGrid.SelectedItem is not User u) return;

            u.Username = UsernameBox.Text;
            u.Password = PasswordBox.Text;

            _db.SaveChanges();
            LoadUsers();
        }

        private void Delete_Click(object sender, RoutedEventArgs e)
        {
            if (UserGrid.SelectedItem is not User u) return;

            _db.Users.Remove(u);
            _db.SaveChanges();
            LoadUsers();
        }
    }
}