using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mdmAdmin.Models
{
    [Table("b_games")]
    public class Game
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("title")]
        public string Title { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        [Column("tag")]
        public string Tag { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        [Column("price")]
        public string Price { get; set; } = null!;

        [Required]
        [MaxLength(500)]
        [Column("desc")]
        public string Desc { get; set; } = null!;

        [Required]
        [MaxLength(500)]
        [Column("thumbnail")]
        public string Thumbnail { get; set; } = null!;

        public ICollection<GamePhoto> Photos { get; set; } = new List<GamePhoto>();
        public ICollection<Ownedg> Owners { get; set; } = new List<Ownedg>();
    }
}
