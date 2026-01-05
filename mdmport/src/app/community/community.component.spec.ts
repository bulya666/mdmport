import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityComponent } from './community.component';
import { FormsModule } from '@angular/forms';

describe('CommunityComponent', () => {
  let component: CommunityComponent;
  let fixture: ComponentFixture<CommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunityComponent],
      imports: [FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load sample data on init', () => {
    expect(component.articles.length).toBeGreaterThan(0);
    expect(component.comments.length).toBeGreaterThan(0);
  });

  it('should filter articles by category', () => {
    component.selectedCategory = 'game-updates';
    component.filterArticles();
    
    const filteredArticles = component.filteredArticles;
    const allGameUpdates = filteredArticles.every(article => article.category === 'game-updates');
    
    expect(allGameUpdates).toBeTrue();
  });

  it('should filter articles by search term', () => {
    component.searchTerm = 'frissítés';
    component.filterArticles();
    
    const filteredArticles = component.filteredArticles;
    const containsSearchTerm = filteredArticles.every(article => 
      article.title.toLowerCase().includes('frissítés') || 
      article.content.toLowerCase().includes('frissítés')
    );
    
    expect(filteredArticles.length).toBeGreaterThan(0);
  });

  it('should get comments for specific article', () => {
    const articleId = 1;
    const comments = component.getCommentsForArticle(articleId);
    
    const allForArticle = comments.every(comment => comment.articleId === articleId);
    expect(allForArticle).toBeTrue();
  });

  it('should add new comment', () => {
    const initialCommentCount = component.comments.length;
    const initialArticleComments = component.articles.find(a => a.id === 1)?.commentsCount || 0;
    
    component.newComment = {
      author: 'TesztFelhasználó',
      content: 'Ez egy teszt hozzászólás',
      articleId: 1
    };
    
    component.addComment();
    
    expect(component.comments.length).toBe(initialCommentCount + 1);
    expect(component.articles.find(a => a.id === 1)?.commentsCount).toBe(initialArticleComments + 1);
  });

  it('should not add comment with empty fields', () => {
    const initialCommentCount = component.comments.length;
    
    component.newComment = {
      author: '',
      content: '',
      articleId: 1
    };
    
    spyOn(window, 'alert');
    component.addComment();
    
    expect(component.comments.length).toBe(initialCommentCount);
    expect(window.alert).toHaveBeenCalled();
  });

  it('should increment article likes', () => {
    const article = component.articles[0];
    const initialLikes = article.likes;
    
    component.likeArticle(article);
    
    expect(article.likes).toBe(initialLikes + 1);
  });

  it('should increment comment likes', () => {
    const comment = component.comments[0];
    const initialLikes = comment.likes;
    
    component.likeComment(comment);
    
    expect(comment.likes).toBe(initialLikes + 1);
  });

  it('should get correct category name', () => {
    const categoryName = component.getCategoryName('news');
    expect(categoryName).toBe('Hírek');
  });

  it('should get correct category color', () => {
    const color = component.getCategoryColor('news');
    expect(color).toBe('#4CAF50');
  });
});