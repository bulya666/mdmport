using mdmAdmin.Data;
using mdmAdmin.Models;
using mdmAdmin.Security;
using Microsoft.EntityFrameworkCore;
using System.Linq;
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

namespace mdmAdmin
{
    public partial class MainWindow : Window
    {
        private readonly AppDbContext _db = new();

        public MainWindow()
        {
            InitializeComponent();
            LoadAll();
        }

        private void LoadAll()
        {
            LoadUsers();
            LoadGames();
            LoadPhotos();
            LoadOwned();
        }
        private void LoadUsers()
        {
            UserGrid.ItemsSource = _db.Users.ToList();
        }
        private bool TrySaveChanges()
        {
            try
            {
                _db.SaveChanges();
                return true;
            }
            catch (DbUpdateException ex)
            {
                var msg = ex.InnerException?.Message ?? ex.GetBaseException()?.Message ?? ex.Message;
                MessageBox.Show(msg, "Database error", MessageBoxButton.OK, MessageBoxImage.Error);
                return false;
            }
        }

        private void UserGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (UserGrid.SelectedItem is User u)
            {
                UsernameBox.Text = u.Username;
                PasswordBox.Text = string.Empty;
            }
            else
            {
                UsernameBox.Text = string.Empty;
                PasswordBox.Text = string.Empty;
            }
        }

        private void AddUser_Click(object sender, RoutedEventArgs e)
        {
            var passwordText = PasswordBox.Text ?? string.Empty;
            if (string.IsNullOrWhiteSpace(UsernameBox.Text) || string.IsNullOrWhiteSpace(passwordText))
            {
                MessageBox.Show("Username and password are required.", "Validation", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var u = new User
            {
                Username = UsernameBox.Text,
                Password = PasswordHasher.HashPassword(passwordText)
            };

            _db.Users.Add(u);
            if (!TrySaveChanges()) return;
            LoadUsers();
        }

        private void UpdateUser_Click(object sender, RoutedEventArgs e)
        {
            if (UserGrid.SelectedItem is not User u) return;

            u.Username = UsernameBox.Text;

            var newPassword = PasswordBox.Text ?? string.Empty;
            if (!string.IsNullOrWhiteSpace(newPassword))
            {
                u.Password = PasswordHasher.HashPassword(newPassword);
            }

            _db.SaveChanges();
            LoadUsers();
        }

        private void DeleteUser_Click(object sender, RoutedEventArgs e)
        {
            if (UserGrid.SelectedItem is not User u) return;

            _db.Users.Remove(u);
            _db.SaveChanges();
            LoadUsers();
        }

        private void LoadGames()
        {
            GameGrid.ItemsSource = _db.Games.ToList();
        }

        private void GameGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (GameGrid.SelectedItem is Game g)
            {
                GameTitleBox.Text = g.Title;
                GameTagBox.Text = g.Tag;
                GamePriceBox.Text = g.Price;
                GameDescBox.Text = g.Desc;
                GameThumbnailBox.Text = g.Thumbnail;
            }
            else
            {
                GameTitleBox.Text = string.Empty;
                GameTagBox.Text = string.Empty;
                GamePriceBox.Text = string.Empty;
                GameDescBox.Text = string.Empty;
                GameThumbnailBox.Text = string.Empty;
            }
        }

        private void AddGame_Click(object sender, RoutedEventArgs e)
        {
            var g = new Game
            {
                Title = GameTitleBox.Text,
                Tag = GameTagBox.Text,
                Price = GamePriceBox.Text,
                Desc = GameDescBox.Text,
                Thumbnail = GameThumbnailBox.Text
            };

            _db.Games.Add(g);
            if (!TrySaveChanges()) return;
            LoadGames();
        }

        private void UpdateGame_Click(object sender, RoutedEventArgs e)
        {
            if (GameGrid.SelectedItem is not Game g) return;

            g.Title = GameTitleBox.Text;
            g.Tag = GameTagBox.Text;
            g.Price = GamePriceBox.Text;
            g.Desc = GameDescBox.Text;
            g.Thumbnail = GameThumbnailBox.Text;

            _db.SaveChanges();
            LoadGames();
        }

        private void DeleteGame_Click(object sender, RoutedEventArgs e)
        {
            if (GameGrid.SelectedItem is not Game g) return;

            _db.Games.Remove(g);
            _db.SaveChanges();
            LoadGames();
        }
        private void LoadPhotos()
        {
            PhotoGrid.ItemsSource = _db.GamePhotos.ToList();
        }

        private void PhotoGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (PhotoGrid.SelectedItem is GamePhoto p)
            {
                PhotoGameIdBox.Text = p.GameId.ToString();
                PhotoPicBox.Text = p.Pic;
            }
            else
            {
                PhotoGameIdBox.Text = string.Empty;
                PhotoPicBox.Text = string.Empty;
            }
        }

        private void AddPhoto_Click(object sender, RoutedEventArgs e)
        {
            if (!int.TryParse(PhotoGameIdBox.Text, out var gameId)) return;

            var p = new GamePhoto
            {
                GameId = gameId,
                Pic = PhotoPicBox.Text
            };

            _db.GamePhotos.Add(p);
            if (!TrySaveChanges()) return;
            LoadPhotos();
        }

        private void UpdatePhoto_Click(object sender, RoutedEventArgs e)
        {
            if (PhotoGrid.SelectedItem is not GamePhoto p) return;
            if (!int.TryParse(PhotoGameIdBox.Text, out var gameId)) return;

            p.GameId = gameId;
            p.Pic = PhotoPicBox.Text;

            _db.SaveChanges();
            LoadPhotos();
        }

        private void DeletePhoto_Click(object sender, RoutedEventArgs e)
        {
            if (PhotoGrid.SelectedItem is not GamePhoto p) return;

            _db.GamePhotos.Remove(p);
            _db.SaveChanges();
            LoadPhotos();
        }

        private void LoadOwned()
        {
            OwnedGrid.ItemsSource = _db.Ownedg.ToList();
        }

        private void OwnedGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (OwnedGrid.SelectedItem is Ownedg o)
            {
                OwnedUserIdBox.Text = o.UserId.ToString();
                OwnedGameIdBox.Text = o.GameId.ToString();
            }
            else
            {
                OwnedUserIdBox.Text = string.Empty;
                OwnedGameIdBox.Text = string.Empty;
            }
        }

        private void AddOwned_Click(object sender, RoutedEventArgs e)
        {
            if (!int.TryParse(OwnedUserIdBox.Text, out var userId)) return;
            if (!int.TryParse(OwnedGameIdBox.Text, out var gameId)) return;

            var o = new Ownedg
            {
                UserId = userId,
                GameId = gameId
            };

            _db.Ownedg.Add(o);
            if (!TrySaveChanges()) return;
            LoadOwned();
        }

        private void UpdateOwned_Click(object sender, RoutedEventArgs e)
        {
            if (OwnedGrid.SelectedItem is not Ownedg o) return;
            if (!int.TryParse(OwnedUserIdBox.Text, out var userId)) return;
            if (!int.TryParse(OwnedGameIdBox.Text, out var gameId)) return;

            o.UserId = userId;
            o.GameId = gameId;

            _db.SaveChanges();
            LoadOwned();
        }

        private void DeleteOwned_Click(object sender, RoutedEventArgs e)
        {
            if (OwnedGrid.SelectedItem is not Ownedg o) return;

            _db.Ownedg.Remove(o);
            _db.SaveChanges();
            LoadOwned();
        }
    }

}