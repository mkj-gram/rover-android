//
//  TableViewController.swift
//  Experiences
//
//  Created by Sean Rucker on 2018-05-20.
//  Copyright © 2018 Sean Rucker. All rights reserved.
//

import RoverExperiences

class TableViewController: UITableViewController {
    @IBOutlet weak var segmentedControl: UISegmentedControl!
    
    private var segmentedExperiences: [ExperienceListItem]? {
        guard let experiences = self.experiences else {
            return nil
        }
        
        return experiences.filter() { (experience) -> Bool in
            switch segmentedControl.selectedSegmentIndex {
            case 0:
                return !experience.isPublished && !experience.isArchived
            case 1:
                return experience.isPublished && !experience.isArchived
            default:
                return false
            }
        }
    }
    
    private var experiences: [ExperienceListItem]?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        NotificationCenter.default.addObserver(forName: .didAuthenticate, object: nil, queue: nil) { _ in
            self.reloadExperiences()
        }
        
        NotificationCenter.default.addObserver(forName: .didInvalidate, object: nil, queue: nil) { _ in
            self.experiences = nil
            self.tableView.reloadData()
        }
        
        refreshControl = UIRefreshControl()
        refreshControl?.addTarget(self, action: #selector(reloadExperiences), for: .valueChanged)
        
        if let accountName = Session.shared.info?.accountName {
            let titleLabel = UILabel()
            titleLabel.text = "Account: \(accountName)"
            titleLabel.font = UIFont.systemFont(ofSize: 15.0)
            titleLabel.textAlignment = .center
            let title = UIBarButtonItem(customView: titleLabel)
            let toolbarItems = [title]
            setToolbarItems(toolbarItems, animated: false)
        }
        
        reloadExperiences()
    }
    
    @objc func reloadExperiences() {
        let url = URL(string: "experience-list-items", relativeTo: APIEndpoint.default.rawValue)!
        var request = URLRequest(url: url)
        Session.shared.authorize(request: &request)
        
        let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
            DispatchQueue.main.async {
                self.refreshControl?.endRefreshing()
                
                guard let data = data else {
                    return
                }
                
                struct Response: Decodable {
                    var data: [ExperienceListItem]
                }
                
                do {
                    let response = try JSONDecoder().decode(Response.self, from: data)
                    self.experiences = response.data
                    self.tableView.reloadData()
                } catch {
                    print(error)
                }
            }
        }
        task.resume()
    }
    
    // MARK: UITableViewDataSource
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return segmentedExperiences?.count ?? 0
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
        
        // TODO: Move this into cell subclass as it has nothing to do with configuration
        
        let backgroundView = UIView()
        backgroundView.backgroundColor = UIColor.dodgerBlue.withAlphaComponent(0.1)
        cell.selectedBackgroundView = backgroundView
        cell.textLabel?.font = UIFont.systemFont(ofSize: 16)
        cell.textLabel?.textColor = UIColor.steel
        
        guard let experience = segmentedExperiences?[indexPath.row] else {
            return cell
        }
        
        cell.textLabel?.text = experience.name
        return cell
    }
    
    // MARK: UITableViewDelegate
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard indexPath.section == 0, let experienceItem = segmentedExperiences?[indexPath.row], let resolver = Rover.shared else {
            return
        }
        
        let experienceID = ID(rawValue: experienceItem.id)
        let identifier = ExperienceIdentifier.experienceID(id: experienceID)
        let viewController = resolver.resolve(UIViewController.self, name: "experience", arguments: identifier)!
        present(viewController, animated: true, completion: nil)
    }
    
    // MARK: Actions
    
    @IBAction func signOut(_ sender: Any) {
        let defaultAction = UIAlertAction(title: "OK", style: .default) { alertAction in
            Session.shared.invalidate()
        }
        
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel, handler: nil)
        
        let alert = UIAlertController(title: "Sign Out", message: "Are you sure you want to sign out?", preferredStyle: .alert)
        alert.addAction(defaultAction)
        alert.addAction(cancelAction)
        
        present(alert, animated: true, completion: nil)
    }
    
    @IBAction func reloadTableView(_ sender: Any) {
        tableView.reloadData()
    }
}

// MARK: ExperienceListItem

fileprivate struct ExperienceListItem: Decodable {
    var id: String
    var hasUnpublishedChanges: Bool
    var isArchived: Bool
    var isPublished: Bool
    var name: String
    var shortURL: URL

    private enum CodingKeys: String, CodingKey {
        case id
        case attributes
    }
    
    private enum AttributesKeys: String, CodingKey {
        case hasUnpublishedChanges = "has-unpublished-changes"
        case isArchived = "is-archived"
        case isPublished = "is-published"
        case name
        case shortURL = "short-url"
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        let attributesContainer = try container.nestedContainer(keyedBy: AttributesKeys.self, forKey: .attributes)
        hasUnpublishedChanges = try attributesContainer.decode(Bool.self, forKey: .hasUnpublishedChanges)
        isArchived = try attributesContainer.decode(Bool.self, forKey: .isArchived)
        isPublished = try attributesContainer.decode(Bool.self, forKey: .isPublished)
        name = try attributesContainer.decode(String.self, forKey: .name)
        shortURL = try attributesContainer.decode(URL.self, forKey: .shortURL)
    }
}
