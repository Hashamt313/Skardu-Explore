<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$route = $_GET['route'] ?? '';
$id = $_GET['id'] ?? null;

$data_dir = __DIR__ . '/server/data';
if (!is_dir($data_dir)) {
    mkdir($data_dir, 0777, true);
}

$file_map = [
    'fleet' => $data_dir . '/fleet.json',
    'tours' => $data_dir . '/tours.json',
    'inquiries' => $data_dir . '/inquiries.json',
    'destinations' => $data_dir . '/destinations.json',
    'settings' => $data_dir . '/settings.json'
];

if (!isset($file_map[$route])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid route']);
    exit;
}

$file_path = $file_map[$route];

// Ensure file exists
if (!file_exists($file_path)) {
    if ($route === 'settings') {
        file_put_contents($file_path, json_encode(['whatsapp' => '923182277086', 'phone' => '+92 318 227 7086']));
    } else {
        file_put_contents($file_path, json_encode([]));
    }
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if ($id !== null) {
        $items = json_decode(file_get_contents($file_path), true) ?: [];
        foreach ($items as $item) {
            if (isset($item['id']) && $item['id'] == $id) {
                echo json_encode($item);
                exit;
            }
        }
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
    } else {
        echo file_get_contents($file_path);
    }
} 
elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid body']);
        exit;
    }
    if ($route === 'settings') {
        file_put_contents($file_path, json_encode($input, JSON_PRETTY_PRINT));
        echo json_encode($input);
    } else {
        $items = json_decode(file_get_contents($file_path), true) ?: [];
        $newItem = array_merge(['id' => round(microtime(true) * 1000)], $input);
        $items[] = $newItem;
        file_put_contents($file_path, json_encode($items, JSON_PRETTY_PRINT));
        echo json_encode($newItem);
    }
} 
elseif ($method === 'PUT' || $method === 'PATCH') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid body']);
        exit;
    }
    if ($route === 'settings') {
        $current = json_decode(file_get_contents($file_path), true) ?: [];
        $updated = array_merge($current, $input);
        file_put_contents($file_path, json_encode($updated, JSON_PRETTY_PRINT));
        echo json_encode($updated);
    } else {
        if ($id === null) {
            http_response_code(400);
            echo json_encode(['error' => 'ID required']);
            exit;
        }
        $items = json_decode(file_get_contents($file_path), true) ?: [];
        $found = false;
        foreach ($items as &$item) {
            if (isset($item['id']) && $item['id'] == $id) {
                $item = array_merge($item, $input, ['id' => $item['id']]);
                $found = $item;
                break;
            }
        }
        if (!$found) {
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
            exit;
        }
        file_put_contents($file_path, json_encode($items, JSON_PRETTY_PRINT));
        echo json_encode($found);
    }
} 
elseif ($method === 'DELETE') {
    if ($id === null) {
        http_response_code(400);
        echo json_encode(['error' => 'ID required']);
        exit;
    }
    $items = json_decode(file_get_contents($file_path), true) ?: [];
    $filtered = [];
    $found = false;
    foreach ($items as $item) {
        if (isset($item['id']) && $item['id'] == $id) {
            $found = true;
        } else {
            $filtered[] = $item;
        }
    }
    if (!$found) {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        exit;
    }
    file_put_contents($file_path, json_encode($filtered, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true]);
}
